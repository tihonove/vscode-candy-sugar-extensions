import fs from "fs";
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

import { SchemaRngParser } from "./SchemaParser/SchemaRngParser";
import { allElements } from "./SugarElements/DefaultSugarElements";
import { CompletionSuggester, SuggestionItemType } from "./Suggester/CompletionSuggester";
import { DataSchemaNode } from "./Suggester/DataSchemaNode";
import { UriUtils } from "./UriUtils";
import { isNotNullOrUndefined } from "./Utils/TypingUtils";

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments = new TextDocuments();
const schemaDocuments: { [uri: string]: string } = {};
const parsedSchemaDocuments: { [uri: string]: DataSchemaNode } = {};
const suggesters: { [uri: string]: CompletionSuggester } = {};

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;
    hasConfigurationCapability = !!capabilities.workspace && !!capabilities.workspace.configuration;
    hasWorkspaceFolderCapability = Boolean(capabilities.workspace && !!capabilities.workspace.workspaceFolders);

    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
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
    const schemaParser = new SchemaRngParser();
    if (schemaDocuments[schemaFileUri] == undefined) {
        try {
            schemaDocuments[schemaFileUri] = fs.readFileSync(schemaFile, "utf8");
            parsedSchemaDocuments[change.document.uri] = schemaParser.toDataSchema(schemaDocuments[schemaFileUri]);
        } catch (e) {
            // ignore read error
        }
    }

    if (suggesters[change.document.uri] == undefined) {
        suggesters[change.document.uri] = new CompletionSuggester(
            [],
            allElements,
            parsedSchemaDocuments[change.document.uri] || { name: "" }
        );
    }
});

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
        const suggester = suggesters[textDocumentPosition.textDocument.uri];

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
                        data: x.name,
                    };
                }
                if (x.type === SuggestionItemType.Attribute) {
                    return {
                        label: x.name,
                        kind: CompletionItemKind.Method,
                        data: x.name,
                    };
                }
                if (x.type === SuggestionItemType.DataElement) {
                    return {
                        label: x.name,
                        kind: CompletionItemKind.Module,
                        data: x.name,
                    };
                }
                if (x.type === SuggestionItemType.DataAttribute) {
                    return {
                        label: x.name,
                        kind: CompletionItemKind.Field,
                        data: x.name,
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
        if (item.data === 1) {
            item.documentation = "TypeScript documentation";
            (item.detail = "Zzz\nsadsajdasd\nsadsa"), (item.documentation = "#aaaa\nsadkjdsa\nsadjsajsa\nsadjlak");
        } else if (item.data === 2) {
            item.detail = "JavaScript details";
            item.documentation = "JavaScript documentation";
        }
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
