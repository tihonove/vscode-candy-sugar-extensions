import fs from "fs";
import path from "path";
import { CancellationToken } from "vscode-jsonrpc";
import {
    CompletionItem,
    CompletionItemKind,
    Connection,
    createConnection,
    InitializeParams,
    ProposedFeatures,
    TextDocumentPositionParams,
    TextDocuments,
} from "vscode-languageserver";
import { Definition, Hover, Range, TextDocumentChangeEvent } from "vscode-languageserver-types";

import { DataSchemaElementNode } from "./DataSchema/DataSchemaNode";
import { ILogger, VsCodeServerLogger } from "./Logger/Logger";
import { MarkdownUtils } from "./MarkdownUtils";
import { CodePosition } from "./PegJSUtils/Types";
import { SchemaRngConverter } from "./SchemaParser/SchemaRngConverter";
import { SugarDocumentServices } from "./SugarDocumentServices";
import { allElements } from "./SugarElements/DefaultSugarElements";
import { SuggestionItemType } from "./Suggester/CompletionSuggester";
import { UriUtils } from "./UriUtils";
import { isNotNullOrUndefined, valueOrDefault } from "./Utils/TypingUtils";

export class SugarLanguageServer {
    private readonly connection: Connection;
    private readonly logger: ILogger;
    private readonly documents: TextDocuments;
    private readonly schemaDocuments: { [uri: string]: string };
    private readonly parsedSchemaDocuments: { [uri: string]: DataSchemaElementNode };
    private readonly documentServices: { [uri: string]: SugarDocumentServices };
    public constructor() {
        this.connection = createConnection(ProposedFeatures.all);
        this.logger = new VsCodeServerLogger(this.connection.console);
        this.documents = new TextDocuments();
        this.schemaDocuments = {};
        this.parsedSchemaDocuments = {};
        this.documentServices = {};
        this.connection.onInitialize(this.handleInitialize);
        this.documents.onDidChangeContent(this.handleChangeDocumentContent);
        this.connection.onHover(this.handleHover);
        this.connection.onDefinition(this.handleResolveDefinition);
        this.connection.onCompletion(this.handleResolveCompletion);
        this.connection.onCompletionResolve(this.handleEnrichCompletionItem);
    }

    public listen(): void {
        this.documents.listen(this.connection);
        this.connection.listen();
    }

    private readonly handleInitialize = (_params: InitializeParams) => ({
        capabilities: {
            textDocumentSync: this.documents.syncKind,
            hoverProvider: true,
            definitionProvider: true,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ["/"],
            },
        },
    });

    private readonly handleChangeDocumentContent = (change: TextDocumentChangeEvent) => {
        if (change.document.languageId !== "sugar-xml") {
            return;
        }
        this.documents[change.document.uri] = change.document.getText();
        const filename = UriUtils.toFileName(change.document.uri);
        const formDirName = path.basename(path.dirname(path.dirname(filename)));
        const schemaFile = path.join(path.dirname(filename), "..", "schemas", formDirName + ".rng.xml");
        const schemaFileUri = UriUtils.fileNameToUri(schemaFile);
        const schemaParser = new SchemaRngConverter();
        if (this.schemaDocuments[schemaFileUri] == undefined) {
            try {
                this.schemaDocuments[schemaFileUri] = fs.readFileSync(schemaFile, "utf8");
                this.parsedSchemaDocuments[change.document.uri] = schemaParser.toDataSchema(
                    this.schemaDocuments[schemaFileUri]
                );
            } catch (e) {
                // ignore read error
            }
        }

        if (this.documentServices[change.document.uri] == undefined) {
            this.documentServices[change.document.uri] = new SugarDocumentServices(
                schemaFileUri,
                valueOrDefault(this.parsedSchemaDocuments[change.document.uri], emptyDataSchema),
                allElements,
                this.logger
            );
        }
        this.documentServices[change.document.uri].sugarDocumentDom.processDocumentChange(change.document.getText());
    };

    private getDocumentServices(uri: string): undefined | SugarDocumentServices {
        if (this.documentServices[uri] != undefined) {
            return this.documentServices[uri];
        }
        return undefined;
    }

    private readonly handleHover = (positionParams: TextDocumentPositionParams): undefined | Hover => {
        const textDocument = this.documents.get(positionParams.textDocument.uri);
        const services = this.getDocumentServices(positionParams.textDocument.uri);
        if (services == undefined || textDocument == undefined) {
            return undefined;
        }
        const context = services.sugarDocumentDom.resolveContextAsOffset(
            textDocument.offsetAt(positionParams.position)
        );
        if (context == undefined) {
            return undefined;
        }
        if (context.type === "ElementName") {
            const hoverContents = MarkdownUtils.buildElementDetails(context.currentElementInfo, { appendHeader: true });
            if (hoverContents == undefined) {
                return undefined;
            }
            return {
                range: this.pegjsPositionToVsCodeRange(context.contextNode.position),
                contents: hoverContents,
            };
        }
        if (context.type === "AttributeName") {
            const hoverContents = MarkdownUtils.buildAttributeDetails(
                context.currentElementInfo,
                context.currentAttributeInfo,
                { appendHeader: true }
            );
            if (hoverContents == undefined) {
                return undefined;
            }
            return {
                range: this.pegjsPositionToVsCodeRange(context.contextNode.position),
                contents: hoverContents,
            };
        }

        if (context.type === "DataAttributeValue") {
            if (context.currentDataContext == undefined) {
                return undefined;
            }
            const value = services.sugarDocumentDom.getDataElementOrAttributeByPath(context.currentDataContext);
            if (value == undefined) {
                return undefined;
            }
            if (value.type === "DataSchemaElementNode") {
                const hoverContents = MarkdownUtils.buildDataSchemaElementDetail(
                    context.currentElementInfo,
                    context.currentAttributeInfo,
                    value,
                    { appendHeader: true }
                );
                if (hoverContents == undefined) {
                    return undefined;
                }
                return {
                    range: this.pegjsPositionToVsCodeRange(context.contextNode.position),
                    contents: hoverContents,
                };
            }
            if (value.type === "DataSchemaAttribute") {
                const hoverContents = MarkdownUtils.buildDataSchemaAttributeDetail(
                    context.currentElementInfo,
                    context.currentAttributeInfo,
                    value,
                    { appendHeader: true }
                );
                if (hoverContents == undefined) {
                    return undefined;
                }
                return {
                    range: this.pegjsPositionToVsCodeRange(context.contextNode.position),
                    contents: hoverContents,
                };
            }
            return undefined;
        }
        return undefined;
    };

    private readonly handleResolveDefinition = (positionParams: TextDocumentPositionParams): undefined | Definition => {
        const services = this.getDocumentServices(positionParams.textDocument.uri);
        const textDocument = this.documents.get(positionParams.textDocument.uri);
        if (services == undefined || textDocument == undefined) {
            return undefined;
        }
        const context = services.sugarDocumentDom.resolveContextAsOffset(
            textDocument.offsetAt(positionParams.position)
        );
        if (context == undefined) {
            return undefined;
        }
        if (context.type === "DataAttributeValue" && context.currentDataContext != undefined) {
            const dataNode = services.sugarDocumentDom.getDataElementOrAttributeByPath(context.currentDataContext);
            const dataSchemaUri = services.sugarDocumentDom.getDataSchemaUri();
            if (dataNode == undefined || dataSchemaUri == undefined) {
                return undefined;
            }
            return {
                range: {
                    start: {
                        character: dataNode.position.start.column - 1,
                        line: dataNode.position.start.line - 1,
                    },
                    end: {
                        character: dataNode.position.end.column - 1,
                        line: dataNode.position.end.line - 1,
                    },
                },
                uri: dataSchemaUri,
            };
        }
        return undefined;
    };

    private pegjsPositionToVsCodeRange(position: CodePosition): Range {
        return {
            start: {
                character: position.start.column - 1,
                line: position.start.line - 1,
            },
            end: {
                character: position.end.column - 1,
                line: position.end.line - 1,
            },
        };
    }

    private readonly handleResolveCompletion = (
        textDocumentPosition: TextDocumentPositionParams,
        _token: CancellationToken
    ): CompletionItem[] => {
        const text = this.documents.get(textDocumentPosition.textDocument.uri);
        if (text == undefined) {
            return [];
        }
        const textToCursor = text.getText({ start: text.positionAt(0), end: textDocumentPosition.position });
        const suggester = this.documentServices[textDocumentPosition.textDocument.uri].suggester;

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
    };

    private readonly handleEnrichCompletionItem = (item: CompletionItem): CompletionItem => {
        // tslint:disable-next-line no-unsafe-any
        const { suggestionItem, uri } = item.data;
        const services = this.documentServices[uri];
        // tslint:disable-next-line no-unsafe-any
        services.descriptionResolver.enrichCompletionItem(item, suggestionItem);
        return item;
    };
}

const emptyDataSchema: DataSchemaElementNode = {
    name: "",
    type: "DataSchemaElementNode",
    position: {
        start: { line: 0, column: 0, offset: 0 },
        end: { line: 0, column: 0, offset: 0 },
    },
};
