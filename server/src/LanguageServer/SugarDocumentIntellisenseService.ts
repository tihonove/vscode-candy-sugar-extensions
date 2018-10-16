import * as fs from "fs";
import * as _ from "lodash";
import path from "path";
import {
    CompletionItem,
    CompletionItemKind,
    Definition,
    Diagnostic,
    DiagnosticSeverity,
    Hover,
    Position,
    Range,
    TextDocumentChangeEvent,
} from "vscode-languageserver-types";

import { DataSchemaElementNode, DataSchemaNode } from "../DataSchema/DataSchemaNode";
import { SchemaRngConverter } from "../DataSchema/DataSchemaParser/SchemaRngConverter";
import { DataSchemaUtils } from "../DataSchema/DataSchemaUtils";
import { CodeContext } from "../SugarAnalyzing/CodeContext";
import { CodeContextByNodeResolver } from "../SugarAnalyzing/CodeContextByNodeResolver";
import { CompletionSuggester, SuggestionItemType } from "../SugarAnalyzing/CompletionSuggester";
import { OffsetToNodeMap } from "../SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMap";
import { OffsetToNodeMapBuilder } from "../SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { allElements } from "../SugarElements/DefaultSugarElementInfos/DefaultSugarElements";
import { SugarElementInfo } from "../SugarElements/SugarElementInfo";
import { createEvent } from "../Utils/Event";
import { CodePosition } from "../Utils/PegJSUtils/Types";
import { isNotNullOrUndefined } from "../Utils/TypingUtils";
import { UriUtils } from "../Utils/UriUtils";
import { SugarValidator } from "../Validator/Validator/SugarValidator";
import { createDefaultValidator } from "../Validator/ValidatorFactory";

import { CompletionItemDescriptionResolver } from "./CompletionItemDescriptionResolver";
import { ILogger } from "./Logging/Logger";
import { MarkdownUtils } from "./MarkdownUtils";

export interface IDocumentOffsetPositionResolver {
    offsetAt(position: Position): number;
    positionAt(offset: number): Position;
}

export class SugarDocumentIntellisenseService {
    private readonly logger: ILogger;
    private readonly parsedSchemaDocuments: DataSchemaElementNode;
    private readonly validator: SugarValidator;
    private readonly documentUri: string;
    private readonly schemaFileUri: string;
    private readonly offsetPositionResolver: IDocumentOffsetPositionResolver;
    private readonly suggester: CompletionSuggester;
    private readonly descriptionResolver: CompletionItemDescriptionResolver;
    private readonly updateDomDebounced = _.debounce((text: string) => this.updateDom(text), 50, { trailing: true });
    private readonly builder: OffsetToNodeMapBuilder;
    private offsetToNodeMap?: OffsetToNodeMap;
    private readonly sugarElements: SugarElementInfo[];

    public sendValidationsEvent = createEvent<[Diagnostic[]]>();

    public constructor(logger: ILogger, documentUri: string, offsetPositionResolver: IDocumentOffsetPositionResolver) {
        this.documentUri = documentUri;
        this.logger = logger;
        this.offsetPositionResolver = offsetPositionResolver;
        this.schemaFileUri = UriUtils.fileNameToUri(this.findSchemaFile(this.documentUri));
        this.parsedSchemaDocuments = this.loadDataSchema();
        this.suggester = new CompletionSuggester([], allElements, this.parsedSchemaDocuments);
        this.descriptionResolver = new CompletionItemDescriptionResolver(this.parsedSchemaDocuments);
        this.sugarElements = allElements;
        this.validator = createDefaultValidator(this.parsedSchemaDocuments);
        this.builder = new OffsetToNodeMapBuilder();
    }

    public handleCloseTextDocument({ document }: TextDocumentChangeEvent): void {
        this.logger.info(`Send empty diagnostics for closed file. (${document.uri})`);
        this.sendEmptyValidations();
    }

    public validateTextDocument(text: string): void {
        this.logger.info(`Begin document validation. (${this.documentUri})`);
        const validationResults = this.validator.validate(text);
        this.sendValidationsEvent.emit(
            validationResults.map(x => ({
                message: x.message,
                range: this.pegjsPositionToVsCodeRange(x.position),
                severity: DiagnosticSeverity.Error,
                source: "sugar-validator",
                code: x.ruleName,
            }))
        );
        this.logger.info(`End document validation. (${this.documentUri})`);
    }

    public processChangeDocumentContent(text: string): void {
        this.logger.info(`Begin handle document change. (${this.documentUri})`);
        this.updateDomDebounced(text);
        this.validateTextDocument(text);
        this.logger.info(`End handle document change. (${this.documentUri})`);
    }

    public getHoverInfoAtPosition(position: Position): undefined | Hover {
        const context = this.resolveContextAsOffset(this.offsetPositionResolver.offsetAt(position));
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
            const value = this.getDataElementOrAttributeByPath(context.currentDataContext);
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
    }

    public getSymbolDefinitionAtPosition(position: Position): undefined | Definition {
        const context = this.resolveContextAsOffset(this.offsetPositionResolver.offsetAt(position));
        if (context == undefined) {
            return undefined;
        }
        if (context.type === "DataAttributeValue" && context.currentDataContext != undefined) {
            const dataNode = this.getDataElementOrAttributeByPath(context.currentDataContext);
            if (dataNode == undefined) {
                return undefined;
            }
            return {
                range: this.pegjsPositionToVsCodeRange(dataNode.position),
                uri: this.schemaFileUri,
            };
        }
        return undefined;
    }

    public getCompletionAfterText(textToCursor: string): CompletionItem[] {
        const suggester = this.suggester;
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
                            uri: this.documentUri,
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
                            uri: this.documentUri,
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
                            uri: this.documentUri,
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
                            uri: this.documentUri,
                        },
                        commitCharacters: ['"'],
                    };
                }
                return undefined;
            })
            .filter(isNotNullOrUndefined);
    }

    public enrichCompletionItem(item: CompletionItem): CompletionItem {
        // tslint:disable-next-line no-unsafe-any
        const { suggestionItem } = item.data;
        // tslint:disable-next-line no-unsafe-any
        this.descriptionResolver.enrichCompletionItem(item, suggestionItem);
        return item;
    }

    private updateDom(text: string): void {
        this.logger.info("Begin update");
        try {
            this.offsetToNodeMap = this.builder.buildOffsetToNodeMap(text);
        } catch (ignoreError) {
            // По всей вимдости код невалиден. Просто оставим последний валидный map
        }
        this.logger.info("End update");
    }

    private getDataElementOrAttributeByPath(path: string[]): undefined | DataSchemaNode {
        return DataSchemaUtils.findSchemaNodeByPath(this.parsedSchemaDocuments, path);
    }

    private resolveContextAsOffset(offset: number): undefined | CodeContext {
        if (this.offsetToNodeMap == undefined) {
            return undefined;
        }
        const contextAtCursorResolver = new CodeContextByNodeResolver(this.sugarElements);
        const node = this.offsetToNodeMap.getNodeByOffset(offset);
        if (node == undefined) {
            return undefined;
        }
        return contextAtCursorResolver.resolveContext(node);
    }

    private loadDataSchema(): DataSchemaElementNode {
        const schemaFile = this.findSchemaFile(this.documentUri);
        const schemaParser = new SchemaRngConverter();
        this.logger.info(`Schema is not loaded. Loading. (${this.documentUri})`);
        try {
            const schemaFileContent = fs.readFileSync(schemaFile, "utf8");
            return schemaParser.toDataSchema(schemaFileContent);
        } catch (e) {
            return emptyDataSchema;
            this.logger.info(`Failed to load schema. (${this.documentUri})`);
            // ignore read error
        }
    }

    private findSchemaFile(uri: string): string {
        const filename = UriUtils.toFileName(uri);
        const formDirName = path.basename(path.dirname(path.dirname(filename)));
        const schemaFile = path.join(path.dirname(filename), "..", "schemas", formDirName + ".rng.xml");
        return schemaFile;
    }

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

    private sendEmptyValidations(): void {
        this.sendValidationsEvent.emit([]);
    }
}

const emptyDataSchema: DataSchemaElementNode = {
    name: "",
    type: "DataSchemaElementNode",
    position: {
        start: { line: 0, column: 0, offset: 0 },
        end: { line: 0, column: 0, offset: 0 },
    },
};