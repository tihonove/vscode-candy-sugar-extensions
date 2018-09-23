import fs from "fs";
import path from "path";
import util from "util";
import {
    CompletionItem,
    CompletionItemKind,
    createConnection,
    Diagnostic,
    DiagnosticSeverity,
    DidChangeConfigurationNotification,
    InitializeParams,
    ProposedFeatures,
    TextDocument,
    TextDocumentPositionParams,
    TextDocuments,
} from "vscode-languageserver";

import { ExpectedToken, getCompletionContext } from "./Suggester/ComletionClassificator";
import { UriUtils } from "./UriUtils";

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments = new TextDocuments();
const schemaDocuments: { [uri: string]: string } = {};

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;
    hasConfigurationCapability = !!capabilities.workspace && !!capabilities.workspace.configuration;
    hasWorkspaceFolderCapability = Boolean(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = Boolean(
        capabilities.textDocument &&
            capabilities.textDocument.publishDiagnostics &&
            capabilities.textDocument.publishDiagnostics.relatedInformation
    );

    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            // Tell the client that the server supports code completion
            completionProvider: {
                resolveProvider: true,
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

const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        documentSettings.clear();
    } else {
        globalSettings = (change.settings.languageServerExample || defaultSettings) as ExampleSettings;
    }
    documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result = documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: "languageServerExample",
        });
        documentSettings.set(resource, result);
    }
    return result;
}

documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});

documents.onDidChangeContent(change => {
    documents[change.document.uri] = change.document.getText();
    const filename = UriUtils.toFileName(change.document.uri);
    const formDirName = path.basename(path.dirname(path.dirname(filename)));

    const schemaFile = path.join(path.dirname(filename), "..", "schemas", formDirName + ".rng.xml");
    const schemaFileUri = UriUtils.fileNameToUri(schemaFile);
    if (schemaDocuments[schemaFileUri] == undefined) {
        try {
            schemaDocuments[schemaFileUri] = fs.readFileSync(schemaFile, "utf8");
        } catch (e) {
            // ignore read error
        }
    }
    validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    // In this simple example we get the settings for every validate run.
    const settings = await getDocumentSettings(textDocument.uri);

    // The validator creates diagnostics for all uppercase words length 2 and more
    const text = textDocument.getText();
    const pattern = /\b[A-Z]{2,}\b/g;
    let match: RegExpExecArray;

    let problems = 0;
    const diagnostics: Diagnostic[] = [];
    while ((match = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
        problems++;
        const diagnosic: Diagnostic = {
            severity: DiagnosticSeverity.Warning,
            range: {
                start: textDocument.positionAt(match.index),
                end: textDocument.positionAt(match.index + match[0].length),
            },
            message: `${match[0]} is all uppercase.`,
            source: "ex",
        };
        if (hasDiagnosticRelatedInformationCapability) {
            diagnosic.relatedInformation = [
                {
                    location: {
                        uri: textDocument.uri,
                        range: { ...diagnosic.range },
                    },
                    message: "Spelling matters",
                },
                {
                    location: {
                        uri: textDocument.uri,
                        range: { ...diagnosic.range },
                    },
                    message: "Particularly for names",
                },
            ];
        }
        diagnostics.push(diagnosic);
    }

    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
    // Monitored files have change in VSCode
    connection.console.log("We received an file change event");
});

connection.onCompletion(
    (textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
        const text = documents.get(textDocumentPosition.textDocument.uri);
        if (text == undefined) {
            return [];
        }
        const textToCursor = text.getText({ start: text.positionAt(0), end: textDocumentPosition.position });
        const sh = schemaDocuments;
        const context = getCompletionContext(textToCursor);
        if (context != undefined) {
            if (context.expectedToken === ExpectedToken.ElementName) {
                return [
                    {
                        label: "input",
                        kind: CompletionItemKind.Text,
                        data: 1,
                    },
                    {
                        label: "page",
                        kind: CompletionItemKind.Text,
                        data: 2,
                    },
                    {
                        label: "type",
                        kind: CompletionItemKind.Text,
                        data: 3,
                    },
                ];
            }
            if (context.expectedToken === ExpectedToken.AttributeName) {
                return [
                    {
                        label: "attr1",
                        kind: CompletionItemKind.Text,
                        data: 1,
                    },
                    {
                        label: "baa1",
                        kind: CompletionItemKind.Text,
                        data: 2,
                    },
                    {
                        label: "qxxx2",
                        kind: CompletionItemKind.Text,
                        data: 3,
                    },
                ];
            }
        }
        return [];
    }
);

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
    (item: CompletionItem): CompletionItem => {
        if (item.data === 1) {
            item.detail = "TypeScript details";
            item.documentation = "TypeScript documentation";
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
