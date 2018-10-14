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
import {
    Definition,
    DiagnosticSeverity,
    Hover,
    Range,
    TextDocument,
    TextDocumentChangeEvent,
} from "vscode-languageserver-types";

import { DataSchemaElementNode } from "../DataSchema/DataSchemaNode";
import { SchemaRngConverter } from "../DataSchema/DataSchemaParser/SchemaRngConverter";
import { SuggestionItemType } from "../SugarAnalyzing/CompletionSuggester";
import { SugarDocumentServices } from "../SugarDocumentServices";
import { allElements } from "../SugarElements/DefaultSugarElementInfos/DefaultSugarElements";
import { UriUtils } from "../UriUtils";
import { CodePosition } from "../Utils/PegJSUtils/Types";
import { isNotNullOrUndefined, valueOrDefault } from "../Utils/TypingUtils";
import { SugarValidator } from "../Validator/Validator/SugarValidator";
import { createDefaultValidator } from "../Validator/ValidatorFactory";

import { ILogger, VsCodeServerLogger } from "./Logger";
import { MarkdownUtils } from "./MarkdownUtils";

export class SugarLanguageServer {
    private readonly connection: Connection;
    private readonly logger: ILogger;
    private readonly documents: TextDocuments;
    private readonly parsedSchemaDocuments: { [uri: string]: undefined | DataSchemaElementNode };
    private readonly documentServices: { [uri: string]: undefined | SugarDocumentServices };
    private validator?: SugarValidator;

    public constructor() {
        this.connection = createConnection(ProposedFeatures.all);
        this.logger = new VsCodeServerLogger(this.connection.console);
        this.documents = new TextDocuments();
        this.parsedSchemaDocuments = {};
        this.documentServices = {};
        this.connection.onInitialize(this.handleInitialize);
        this.documents.onDidChangeContent(this.handleChangeDocumentContent);
        this.documents.onDidClose(this.handleCloseTextDocument);
        this.connection.onHover(this.handleHover);
        this.connection.onDefinition(this.handleResolveDefinition);
        this.connection.onCompletion(this.handleResolveCompletion);
        this.connection.onCompletionResolve(this.handleEnrichCompletionItem);
    }

    public listen(): void {
        this.documents.listen(this.connection);
        this.connection.listen();
    }

    private readonly handleCloseTextDocument = ({ document }: TextDocumentChangeEvent): void => {
        this.logger.info(`Send empty diagnostics for closed file. (${document.uri})`);
        this.connection.sendDiagnostics({
            uri: document.uri,
            diagnostics: [],
        });
        if (this.parsedSchemaDocuments[document.uri] != undefined) {
            this.parsedSchemaDocuments[document.uri] = undefined;
        }
        if (this.documentServices[document.uri] != undefined) {
            this.documentServices[document.uri] = undefined;
        }
    };

    private async validateTextDocument(textDocument: TextDocument): Promise<void> {
        if (this.validator == undefined) {
            return;
        }
        this.logger.info(`Begin document validation. (${textDocument.uri})`);
        const validationResults = this.validator.validate(textDocument.getText());
        this.connection.sendDiagnostics({
            uri: textDocument.uri,
            diagnostics: validationResults.map(x => ({
                message: x.message,
                range: this.pegjsPositionToVsCodeRange(x.position),
                severity: DiagnosticSeverity.Error,
                source: "sugar-validator",
                code: x.ruleName,
            })),
        });
        this.logger.info(`End document validation. (${textDocument.uri})`);
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
        const documentUri = change.document.uri;
        this.logger.info(`Begin handle document change. (${documentUri})`);
        if (change.document.languageId !== "sugar-xml") {
            return;
        }
        this.documents[documentUri] = change.document.getText();
        const schemaFile = this.findSchemaFile(documentUri);
        const schemaFileUri = UriUtils.fileNameToUri(schemaFile);
        const schemaParser = new SchemaRngConverter();
        if (this.parsedSchemaDocuments[documentUri] == undefined) {
            this.logger.info(`Schema is not loaded. Loading. (${documentUri})`);
            try {
                const schemaFileContent = fs.readFileSync(schemaFile, "utf8");
                this.parsedSchemaDocuments[documentUri] = schemaParser.toDataSchema(schemaFileContent);
            } catch (e) {
                this.logger.info(`Failed to load schema. (${documentUri})`);
                // ignore read error
            }
        }

        let documentService = this.documentServices[documentUri];
        if (documentService == undefined) {
            this.logger.info(`Create services for document. (${documentUri})`);
            documentService = new SugarDocumentServices(
                schemaFileUri,
                valueOrDefault(this.parsedSchemaDocuments[documentUri], emptyDataSchema),
                allElements,
                this.logger
            );
            this.documentServices[documentUri] = documentService;
        }
        documentService.sugarDocumentDom.processDocumentChange(change.document.getText());
        this.validator = createDefaultValidator(this.parsedSchemaDocuments[documentUri]);
        this.validateTextDocument(change.document);
        this.logger.info(`End handle document change. (${documentUri})`);
    };

    private findSchemaFile(uri: string): string {
        const filename = UriUtils.toFileName(uri);
        const formDirName = path.basename(path.dirname(path.dirname(filename)));
        const schemaFile = path.join(path.dirname(filename), "..", "schemas", formDirName + ".rng.xml");
        return schemaFile;
    }

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
        const documentService = this.documentServices[textDocumentPosition.textDocument.uri];
        if (documentService == undefined) {
            return [];
        }
        const suggester = documentService.suggester;

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
                        commitCharacters: [" "],
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
                        commitCharacters: ["="],
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
                        commitCharacters: ["/"],
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
                        commitCharacters: ['"'],
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
        if (services == undefined) {
            return item;
        }
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
