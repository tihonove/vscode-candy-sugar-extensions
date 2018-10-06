import fs from "fs";
import _ from "lodash";
import path from "path";
import { CancellationToken } from "vscode-jsonrpc";
import {
    CompletionItem,
    CompletionItemKind,
    createConnection,
    DidChangeConfigurationNotification,
    InitializeParams,
    ProposedFeatures,
    TextDocumentPositionParams,
    TextDocuments,
} from "vscode-languageserver";
import { Definition, Hover } from "vscode-languageserver-types";

import { DataSchemaNode } from "./DataShema/DataSchemaNode";
import { VsCodeServerLogger } from "./Logger/Logger";
import { SchemaRngConverter } from "./SchemaParser/SchemaRngConverter";
import { SugarElementName } from "./SugarCodeDomBuilder/SugarCodeDomBuilder";
import { SugarDocumentServices } from "./SugarDocumentServices";
import { SuggestionItemType } from "./Suggester/CompletionSuggester";
import { UriUtils } from "./UriUtils";
import { isNotNullOrUndefined, valueOrDefault } from "./Utils/TypingUtils";

const connection = createConnection(ProposedFeatures.all);
const logger = new VsCodeServerLogger(connection.console);
const documents: TextDocuments = new TextDocuments();
const schemaDocuments: { [uri: string]: string } = {};
const parsedSchemaDocuments: { [uri: string]: DataSchemaNode } = {};
const documentServices: { [uri: string]: SugarDocumentServices } = {};

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;
    hasConfigurationCapability = capabilities.workspace != undefined && Boolean(capabilities.workspace.configuration);
    hasWorkspaceFolderCapability =
        capabilities.workspace != undefined && Boolean(capabilities.workspace.workspaceFolders);

    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            hoverProvider: true,
            definitionProvider: true,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ["/"],
            },
        },
    };
});

connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log("Workspace folder change event received.");
        });
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log("Workspace folder change event received.");
        });
    }
});

interface ExampleSettings {
    maxNumberOfProblems: number;
}

const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(() => {
    if (hasConfigurationCapability) {
        documentSettings.clear();
    }
});

documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});

documents.onDidChangeContent(change => {
    documents[change.document.uri] = change.document.getText();
    const filename = UriUtils.toFileName(change.document.uri);
    const formDirName = path.basename(path.dirname(path.dirname(filename)));
    const schemaFile = path.join(path.dirname(filename), "..", "schemas", formDirName + ".rng.xml");
    const schemaFileUri = UriUtils.fileNameToUri(schemaFile);
    const schemaParser = new SchemaRngConverter();
    if (schemaDocuments[schemaFileUri] == undefined) {
        try {
            schemaDocuments[schemaFileUri] = fs.readFileSync(schemaFile, "utf8");
            parsedSchemaDocuments[change.document.uri] = schemaParser.toDataSchema(schemaDocuments[schemaFileUri]);
        } catch (e) {
            // ignore read error
        }
    }

    if (documentServices[change.document.uri] == undefined) {
        documentServices[change.document.uri] = new SugarDocumentServices(
            valueOrDefault(parsedSchemaDocuments[change.document.uri], emptyDataSchema),
            logger
        );
    }
    documentServices[change.document.uri].sugarDocumentDom.processDocumentChange(change.document.getText());
});

const emptyDataSchema: DataSchemaNode = {
    name: "",
    position: {
        start: { line: 0, column: 0, offset: 0 },
        end: { line: 0, column: 0, offset: 0 },
    },
};

connection.onHover(
    (positionParams: TextDocumentPositionParams): undefined | Hover => {
        if (documentServices[positionParams.textDocument.uri] != undefined) {
            const sugarDocumentDom = documentServices[positionParams.textDocument.uri].sugarDocumentDom;
            if (sugarDocumentDom.map != undefined) {
                const textDocument = documents.get(positionParams.textDocument.uri);
                if (textDocument == undefined) {
                    return undefined;
                }
                const offset = textDocument.offsetAt(positionParams.position);
                const node = sugarDocumentDom.map.getNodeByOffset(offset);
                if (node instanceof SugarElementName) {
                    return {
                        range: {
                            start: textDocument.positionAt(node.position.start.offset),
                            end: textDocument.positionAt(node.position.end.offset),
                        },
                        contents: {
                            kind: "markdown",
                            value: "## " + node.name,
                        },
                    };
                }
            }
        }
        return undefined;
    }
);

connection.onDefinition(
    (positionParams: TextDocumentPositionParams): undefined | Definition => {
        return undefined;
        return {
            range: {
                start: {
                    ...positionParams.position,
                    character: positionParams.position.character - 3,
                    line: positionParams.position.line - 1,
                },
                end: {
                    ...positionParams.position,
                    character: positionParams.position.character + 3,
                    line: positionParams.position.line - 1,
                },
            },
            uri: positionParams.textDocument.uri,
        };
    }
);

connection.onDidChangeWatchedFiles(_change => {
    connection.console.log("We received an file change event");
});

connection.onCompletion(
    (textDocumentPosition: TextDocumentPositionParams, _token: CancellationToken): CompletionItem[] => {
        const text = documents.get(textDocumentPosition.textDocument.uri);
        if (text == undefined) {
            return [];
        }
        const textToCursor = text.getText({ start: text.positionAt(0), end: textDocumentPosition.position });
        const suggester = documentServices[textDocumentPosition.textDocument.uri].suggester;

        if (suggester == undefined) {
            return [];
        }
        const results = suggester.suggest(textToCursor);
        if (results == undefined) {
            return [];
        }
        return results.items
            .map(x => {
                if (x.type === SuggestionItemType.Element) {
                    return {
                        label: x.name,
                        kind: CompletionItemKind.Constructor,
                        data: {
                            suggestionItem: x,
                            uri: textDocumentPosition.textDocument.uri,
                        },
                    };
                }
                if (x.type === SuggestionItemType.Attribute) {
                    return {
                        label: x.name,
                        kind: CompletionItemKind.Method,
                        data: {
                            suggestionItem: x,
                            uri: textDocumentPosition.textDocument.uri,
                        },
                    };
                }
                if (x.type === SuggestionItemType.DataElement) {
                    return {
                        label: x.name,
                        kind: CompletionItemKind.Module,
                        data: {
                            suggestionItem: x,
                            uri: textDocumentPosition.textDocument.uri,
                        },
                    };
                }
                if (x.type === SuggestionItemType.DataAttribute) {
                    return {
                        label: x.name,
                        kind: CompletionItemKind.Field,
                        data: {
                            suggestionItem: x,
                            uri: textDocumentPosition.textDocument.uri,
                        },
                    };
                }
                return undefined;
            })
            .filter(isNotNullOrUndefined);
    }
);

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
    (item: CompletionItem): CompletionItem => {
        // tslint:disable-next-line no-unsafe-any
        const { suggestionItem, uri } = item.data;
        const services = documentServices[uri];
        // tslint:disable-next-line no-unsafe-any
        services.descriptionResolver.enrichCompletionItem(item, suggestionItem);
        return item;
    }
);

/*
connection.onDidOpenTextDocument((params) => {
    textDocuments[params.textDocument.uri] = params.textDocument;
});

connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
	connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.uri uniquely identifies the document.
	connection.console.log(`${params.textDocument.uri} closed.`);
});
*/

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
