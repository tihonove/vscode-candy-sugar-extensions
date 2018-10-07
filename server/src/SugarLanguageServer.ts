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
import { Definition, Hover, MarkupContent, Range, TextDocumentChangeEvent } from "vscode-languageserver-types";

import { DataSchemaElementNode } from "./DataSchema/DataSchemaNode";
import { ILogger, VsCodeServerLogger } from "./Logger/Logger";
import { MarkdownUtils } from "./MarkdownUtils";
import { CodePosition } from "./PegJSUtils/Types";
import { SchemaRngConverter } from "./SchemaParser/SchemaRngConverter";
import { SugarDocumentServices } from "./SugarDocumentServices";
import { allElements } from "./SugarElements/DefaultSugarElements";
import { SuggestionItemType } from "./Suggester/CompletionSuggester";
import { SugarElementInfo } from "./Suggester/SugarElementInfo";
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
            const hoverContents = this.buildElementHoverContents(context.currentElementInfo);
            if (hoverContents == undefined) {
                return undefined;
            }
            return {
                range: this.pegjsPositionToVsCodeRange(context.contextNode.position),
                contents: hoverContents,
            };
        }

        // Примеры офрмления хинта
        // return {
        //     range: {
        //         start: {
        //             ...positionParams.position,
        //             character: positionParams.position.character - 1,
        //         },
        //         end: {
        //             ...positionParams.position,
        //             character: positionParams.position.character + 1,
        //         },
        //     },
        //     contents: [
        //         {
        //             language: "css",
        //             value: "value: string",
        //         },
        //         "Подробное или не очень на достаточное описаиние атрибута",
        //     ],
        // };
        // return {
        //     range: {
        //         start: {
        //             ...positionParams.position,
        //             character: positionParams.position.character - 1,
        //         },
        //         end: {
        //             ...positionParams.position,
        //             character: positionParams.position.character + 1,
        //         },
        //     },
        //     contents: [
        //         {
        //             language: "html",
        //             value: "<input>",
        //         },
        //         "Текстовое поле ввода для строк.",
        //     ],
        // };

        // if (this.documentServices[positionParams.textDocument.uri] != undefined) {
        //     const sugarDocumentDom = this.documentServices[positionParams.textDocument.uri].sugarDocumentDom;
        //     if (sugarDocumentDom.map != undefined) {
        //         const textDocument = this.documents.get(positionParams.textDocument.uri);
        //         if (textDocument == undefined) {
        //             return undefined;
        //         }
        //         const offset = textDocument.offsetAt(positionParams.position);
        //         const node = sugarDocumentDom.map.getNodeByOffset(offset);
        //         if (node != undefined && node.type === "ElementName") {
        //             return {
        //                 range: {
        //                     start: textDocument.positionAt(node.position.start.offset),
        //                     end: textDocument.positionAt(node.position.end.offset),
        //                 },
        //                 contents: {
        //                     kind: "markdown",
        //                     value: "## " + node.value,
        //                 },
        //             };
        //         }
        //     }
        // }
        return undefined;
    };

    private buildElementHoverContents(sugarElementInfo: undefined | SugarElementInfo): undefined | MarkupContent {
        return MarkdownUtils.buildElementDetails(sugarElementInfo, { appendHeader: true });
    }

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
        // Примеры офрмления документашки
        //         return [
        //             {
        //                 label: "some value",
        //                 kind: CompletionItemKind.Constructor,
        //                 data: {},
        //                 documentation: {
        //                     kind: "markdown",
        //                     value: ` \`\`\`xml
        // <element name="СумПУВД" multiple="true">
        // \`\`\`
        //
        // Сумма единого налога на вмененный доход, подлежащая уплате в бюджет, по коду ОКТМО
        // `,
        //                 },
        //             },
        //         ];
        //
        //         return [
        //             {
        //                 label: "some value",
        //                 kind: CompletionItemKind.Constructor,
        //                 data: {},
        //                 documentation: {
        //                     kind: "markdown",
        //                     value: ` \`\`\`xml
        // <attribute name="ФормРеорг">
        // \`\`\`
        //
        // Код формы реорганизации (ликвидация). Принимает значение: 0 – ликвидация | 1 – преобразование | 2 – слияние | 3 – разделение | 5 – присоединение | 6 – разделение с одновременным присоединением
        //
        // \`\`\`xml
        // <type base="string">
        //     <length value="1" />
        //     <enumeration value="1" />
        //     <enumeration value="2" />
        //     <enumeration value="3" />
        //     <enumeration value="5" />
        //     <enumeration value="6" />
        //     <enumeration value="0" />
        // </type>
        // \`\`\`
        // `,
        //                 },
        //             },
        //         ];
        //
        //         return [
        //             {
        //                 label: "some value",
        //                 kind: CompletionItemKind.Constructor,
        //                 data: {},
        //                 documentation: {
        //                     kind: "markdown",
        //                     value: ` \`\`\`common
        // value="[DataPath]"
        // \`\`\`
        //
        // Путь до значения вся хуйня
        // `,
        //                 },
        //             },
        //         ];
        //
        //         return [
        //             {
        //                 label: "some value",
        //                 kind: CompletionItemKind.Constructor,
        //                 data: {},
        //                 documentation: {
        //                     kind: "markdown",
        //                     value: ` \`\`\`html
        // <input>
        // \`\`\`
        //
        // Текстовое поле ввода
        //
        // **Атрибуты**:
        // - \`value: DataPath\` - путь к данным
        // - \`width: string\` - ширина тексового поля
        // `,
        //                 },
        //             },
        //         ];

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
