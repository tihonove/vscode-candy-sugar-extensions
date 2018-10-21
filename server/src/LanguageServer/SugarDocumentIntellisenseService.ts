import * as fs from "fs";
import * as _ from "lodash";
import path from "path";
import {
    CodeLens,
    CompletionItem,
    CompletionItemKind,
    Definition,
    Diagnostic,
    DiagnosticSeverity,
    Hover,
    Location,
    MarkupKind,
    Position,
    Range,
    TextDocumentChangeEvent,
} from "vscode-languageserver-types";

import { DataSchemaElementNode, DataSchemaNode } from "../DataSchema/DataSchemaNode";
import { SchemaRngConverter } from "../DataSchema/DataSchemaParser/SchemaRngConverter";
import { DataSchemaUtils } from "../DataSchema/DataSchemaUtils";
import { CompletionSuggester } from "../SugarAnalyzing/ComletionSuggesting/CompletionSuggester";
import { SuggestionItem, SuggestionItemType } from "../SugarAnalyzing/ComletionSuggesting/SuggestionItem";
import { CodeContext } from "../SugarAnalyzing/ContextResolving/CodeContext";
import { CodeContextByNodeResolver } from "../SugarAnalyzing/ContextResolving/CodeContextByNodeResolver";
import { OffsetToNodeMap } from "../SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMap";
import { OffsetToNodeMapBuilder } from "../SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { TypeInfoExtractor } from "../SugarAnalyzing/TypeInfoExtraction/TypeInfoExtractor";
import { UserDefinedTypeUsagesBuilder } from "../SugarAnalyzing/UserDefinedTypeUsagesAnalizing/UserDefinedTypeUsagesBuilder";
import { UserDefinedTypeUsagesInfo } from "../SugarAnalyzing/UserDefinedTypeUsagesAnalizing/UserDefinedTypeUsagesInfo";
import { allElements } from "../SugarElements/DefaultSugarElementInfos/DefaultSugarElements";
import { sugarElementsGroups } from "../SugarElements/DefaultSugarElementInfos/DefaultSugarElementsGrouped";
import { AttributeType, SugarElementInfo } from "../SugarElements/SugarElementInfo";
import { defaultBuiltInTypeNames, TypeKind, UserDefinedSugarTypeInfo } from "../SugarElements/UserDefinedSugarTypeInfo";
import {
    SugarAttribute,
    SugarAttributeName,
    SugarAttributeValue,
    SugarElement,
    SugarElementName,
} from "../SugarParsing/SugarGrammar/SugarParser";
import { oc } from "../Utils/ChainWrapper";
import { createEvent } from "../Utils/Event";
import { CodePosition } from "../Utils/PegJSUtils/Types";
import { isNotNullOrUndefined } from "../Utils/TypingUtils";
import { UriUtils } from "../Utils/UriUtils";
import { SugarValidator } from "../Validator/Validator/SugarValidator";
import { createDefaultValidator } from "../Validator/ValidatorFactory";

import { HelpUrlBuilder } from "./HelpUrlBuilder";
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
    private readonly typeInfoExtractor: TypeInfoExtractor;
    private readonly builder: OffsetToNodeMapBuilder;
    private offsetToNodeMap?: OffsetToNodeMap;
    private userDefinedTypes?: UserDefinedSugarTypeInfo[];
    private userDefinedTypeUsagesInfo?: UserDefinedTypeUsagesInfo[];
    private readonly sugarElements: SugarElementInfo[];
    private readonly helpUrlBuilder: HelpUrlBuilder;
    public sendValidationsEvent = createEvent<[Diagnostic[]]>();

    private updateDomListeners: Array<() => void> = [];

    public readonly updateDomDebounced = _.debounce((text: string) => this.updateDom(text), 50, { trailing: true });

    public constructor(logger: ILogger, documentUri: string, offsetPositionResolver: IDocumentOffsetPositionResolver) {
        this.documentUri = documentUri;
        this.logger = logger;
        this.offsetPositionResolver = offsetPositionResolver;
        this.schemaFileUri = UriUtils.fileNameToUri(this.findSchemaFile(this.documentUri));
        this.parsedSchemaDocuments = this.loadDataSchema();
        this.suggester = new CompletionSuggester([], allElements, this.parsedSchemaDocuments);
        this.sugarElements = allElements;
        this.validator = createDefaultValidator(this.parsedSchemaDocuments);
        this.builder = new OffsetToNodeMapBuilder();
        this.typeInfoExtractor = new TypeInfoExtractor();
        this.helpUrlBuilder = new HelpUrlBuilder(sugarElementsGroups);
    }

    public getCodeLenses(): undefined | CodeLens[] {
        if (this.userDefinedTypeUsagesInfo != undefined) {
            return this.userDefinedTypeUsagesInfo.map<CodeLens>(x => ({
                range: this.pegjsPositionToVsCodeRange(x.type.position),
                command: {
                    command: x.usages.length > 0 ? "vscode-candy-sugar.open-usages-at-offset" : "",
                    title: x.usages.length === 1 ? `1 usage` : `${x.usages.length} usages`,
                    arguments: [x.type.position.start.offset + 1],
                },
            }));
        }
        return undefined;
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

    public findAllReferences(position: Position): undefined | Location[] {
        const context = this.resolveContextAsOffset(this.offsetPositionResolver.offsetAt(position));
        if (context == undefined) {
            return undefined;
        }
        const typeElement = this.findNearestTypeElement(context.contextNode);
        const typeName = oc(typeElement)
            .with(x => x.attributes)
            .with(x => x.find(x => x.name.value === "name"))
            .with(x => x.value)
            .with(x => x.value)
            .return(x => x, undefined);
        if (typeName != undefined && this.userDefinedTypeUsagesInfo != undefined) {
            const usages = this.userDefinedTypeUsagesInfo.find(x => x.type.name === typeName);
            if (usages != undefined) {
                return usages.usages.map(x => ({
                    uri: this.documentUri,
                    range: this.pegjsPositionToVsCodeRange(x.elementPosition),
                }));
            }
        }
        return undefined;
    }

    public getHelpUrlForCurrentPosition(caretOffset: number): undefined | string {
        const context = this.resolveContextAsOffset(caretOffset);
        if (context == undefined) {
            return undefined;
        }
        if (context.type === "ElementName") {
            return this.helpUrlBuilder.getHelpUrlForElement(context.contextNode.value);
        }
        if (context.type === "AttributeName") {
            return this.helpUrlBuilder.getHelpUrlForAttribute(
                context.contextNode.parent.name.value,
                context.contextNode.value
            );
        }
        return undefined;
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

        if (context.type === "AttributeValue" && context.currentAttributeInfo != undefined) {
            if (context.currentAttributeInfo.valueTypes.includes(AttributeType.Type)) {
                const typeName = context.contextNode.value;
                if (this.userDefinedTypes != undefined) {
                    const userDefinedTypeInfo = this.userDefinedTypes.find(x => x.name === typeName);
                    if (userDefinedTypeInfo != undefined) {
                        let documentationText = "";
                        if (userDefinedTypeInfo.description != undefined) {
                            documentationText += "```xml\n";
                            documentationText += `<type name="${userDefinedTypeInfo.name}" />\n`;
                            documentationText += "```\n";
                        }
                        if (userDefinedTypeInfo.description != undefined) {
                            documentationText += userDefinedTypeInfo.description + "\n";
                        }
                        if (userDefinedTypeInfo.constraintStrings.length > 0) {
                            documentationText += "```xml\n";
                            documentationText += userDefinedTypeInfo.constraintStrings.join("\n");
                            documentationText += "```\n";
                        }

                        return {
                            range: this.pegjsPositionToVsCodeRange(context.contextNode.position),
                            contents: {
                                kind: MarkupKind.Markdown,
                                value: documentationText,
                            },
                        };
                    }
                }
                if (defaultBuiltInTypeNames.includes(typeName)) {
                    return {
                        range: this.pegjsPositionToVsCodeRange(context.contextNode.position),
                        contents: {
                            kind: MarkupKind.Markdown,
                            value: `**${typeName}**\nBuiltIn type`,
                        },
                    };
                }
            }
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
        if (
            context.type === "AttributeValue" &&
            this.userDefinedTypes != undefined &&
            context.currentAttributeInfo != undefined &&
            context.currentAttributeInfo.valueTypes.includes(AttributeType.Type)
        ) {
            const userDefinedTypeInfo = this.userDefinedTypes.find(x => x.name === context.contextNode.value);
            if (userDefinedTypeInfo == undefined) {
                return undefined;
            }
            return {
                range: this.pegjsPositionToVsCodeRange(userDefinedTypeInfo.position),
                uri: this.documentUri,
            };
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
                if (x.type === SuggestionItemType.Type) {
                    return {
                        label: x.name,
                        kind:
                            x.typeKind === TypeKind.UserDefined
                                ? CompletionItemKind.Class
                                : CompletionItemKind.Interface,
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
        const suggestionItem: SuggestionItem = item.data.suggestionItem;
        const vsCodeCompletionItem = item;

        if (suggestionItem.type === SuggestionItemType.Element) {
            const elementInfo = allElements.find(x => x.name === suggestionItem.name);

            if (elementInfo != undefined) {
                if (elementInfo.attributes != undefined && elementInfo.attributes.length > 0) {
                    vsCodeCompletionItem.detail = `<${elementInfo.name} ... />`;
                } else {
                    vsCodeCompletionItem.detail = `<${elementInfo.name} />`;
                }
                const documentation = MarkdownUtils.buildElementDetails(elementInfo, { appendHeader: false });
                if (documentation != undefined) {
                    vsCodeCompletionItem.documentation = documentation;
                }
            }
        }

        if (suggestionItem.type === SuggestionItemType.Attribute) {
            const elementInfo = allElements.find(x => x.name === suggestionItem.parentElementName);
            if (elementInfo != undefined) {
                if (elementInfo.attributes != undefined && elementInfo.attributes.length > 0) {
                    const attributeInfo = elementInfo.attributes.find(x => x.name === suggestionItem.name);
                    if (attributeInfo != undefined) {
                        vsCodeCompletionItem.detail = MarkdownUtils.buildAttributeHeader(attributeInfo);
                        vsCodeCompletionItem.documentation = MarkdownUtils.buildAttributeDetails(
                            elementInfo,
                            attributeInfo,
                            { appendHeader: false }
                        );
                    }
                }
            }
        }

        if (suggestionItem.type === SuggestionItemType.DataElement) {
            const dataSchemaNode = DataSchemaUtils.findElementByPath(
                this.parsedSchemaDocuments,
                suggestionItem.fullPath
            );
            if (dataSchemaNode == undefined) {
                return vsCodeCompletionItem;
            }
            vsCodeCompletionItem.detail = `<element name="${dataSchemaNode.name}">`;
            if (dataSchemaNode.description != undefined) {
                vsCodeCompletionItem.documentation = MarkdownUtils.buildDataSchemaElementDetail(
                    undefined,
                    undefined,
                    dataSchemaNode,
                    { appendHeader: false }
                );
            }
        }

        if (suggestionItem.type === SuggestionItemType.DataAttribute) {
            const dataSchemaAttribute = DataSchemaUtils.findAttributeByPath(
                this.parsedSchemaDocuments,
                suggestionItem.fullPath
            );
            if (dataSchemaAttribute == undefined) {
                return vsCodeCompletionItem;
            }
            vsCodeCompletionItem.detail = `<attribute name="${dataSchemaAttribute.name}">`;
            if (dataSchemaAttribute.description != undefined) {
                vsCodeCompletionItem.documentation = MarkdownUtils.buildDataSchemaAttributeDetail(
                    undefined,
                    undefined,
                    dataSchemaAttribute,
                    { appendHeader: false }
                );
            }
        }
        if (suggestionItem.type === SuggestionItemType.Type && this.userDefinedTypes != undefined) {
            const userDefinedTypeInfo = this.userDefinedTypes.find(x => x.name === suggestionItem.name);
            if (userDefinedTypeInfo == undefined) {
                vsCodeCompletionItem.detail = `BuiltIn type`;
                return vsCodeCompletionItem;
            } else {
                vsCodeCompletionItem.detail = `<type name="${suggestionItem.name}">`;
            }
            let documentationText = "";
            if (userDefinedTypeInfo.description != undefined) {
                documentationText += userDefinedTypeInfo.description + "\n";
            }
            if (userDefinedTypeInfo.constraintStrings.length > 0) {
                documentationText += "```xml\n";
                documentationText += userDefinedTypeInfo.constraintStrings.join("\n");
                documentationText += "```\n";
            }
            vsCodeCompletionItem.documentation = {
                kind: "markdown",
                value: documentationText,
            };
        }
        return vsCodeCompletionItem;
    }

    public ensureCodeDomUpdated(): Promise<void> {
        return new Promise(resolve => {
            this.updateDomListeners.push(resolve);
        });
    }

    private findNearestTypeElement(
        contextNode: SugarAttribute | SugarElement | SugarElementName | SugarAttributeName | SugarAttributeValue
    ): undefined | SugarElement {
        if (contextNode.type === "Element" && contextNode.name.value === "type") {
            return contextNode;
        }
        if (contextNode.parent == undefined) {
            return undefined;
        }
        return this.findNearestTypeElement(contextNode.parent);
    }

    private updateDom(text: string): void {
        this.logger.info("Begin update");
        try {
            const sugarDocument = this.builder.buildCodeDom(text);
            this.offsetToNodeMap = this.builder.buildOffsetToNodeMapFromDom(sugarDocument);
            this.userDefinedTypes = this.typeInfoExtractor.extractTypeInfos(sugarDocument);
            this.suggester.updateUserDefinedSugarType(this.userDefinedTypes);
            const usagesBuilder = new UserDefinedTypeUsagesBuilder(this.sugarElements);
            this.userDefinedTypeUsagesInfo = usagesBuilder.buildUsages(this.userDefinedTypes, sugarDocument);
            this.domUpdateCompleted();
        } catch (ignoreError) {
            // По всей вимдости код невалиден. Просто оставим последний валидный map
        }
        this.logger.info("End update");
    }

    private domUpdateCompleted(): void {
        const listeners = this.updateDomListeners;
        this.updateDomListeners = [];
        for (const listener of listeners) {
            listener();
        }
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
