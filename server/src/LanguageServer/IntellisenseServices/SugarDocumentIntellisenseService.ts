import * as _ from "lodash";
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

import { DataSchemaElementNode, DataSchemaNode } from "../../DataSchema/DataSchemaNode";
import { DataSchemaUtils } from "../../DataSchema/DataSchemaUtils";
import { CompletionSuggester } from "../../SugarAnalyzing/ComletionSuggesting/CompletionSuggester";
import { SuggestionItem, SuggestionItemType } from "../../SugarAnalyzing/ComletionSuggesting/SuggestionItem";
import { CodeContext } from "../../SugarAnalyzing/ContextResolving/CodeContext";
import { CodeContextByNodeResolver } from "../../SugarAnalyzing/ContextResolving/CodeContextByNodeResolver";
import { OffsetToNodeMap } from "../../SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMap";
import { OffsetToNodeMapBuilder } from "../../SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { standardElements } from "../../SugarElements/DefaultSugarElementInfos/DefaultSugarElements";
import { sugarElementsGroups } from "../../SugarElements/DefaultSugarElementInfos/DefaultSugarElementsGrouped";
import { AttributeType, SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { defaultBuiltInTypeNames, TypeKind } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarFormatter } from "../../SugarFormatter/SugarFormatter";
import { createEvent } from "../../Utils/Event";
import { CodePosition } from "../../Utils/PegJSUtils/Types";
import { isNotNullOrUndefined } from "../../Utils/TypingUtils";
import { UriUtils } from "../../Utils/UriUtils";
import { ValidCodeStyleRule } from "../../Validator/Rules/ValidCodeStyleRule";
import { SettingsResolver } from "../../Validator/Settings/SettingsResolver";
import { SugarValidator } from "../../Validator/Validator/SugarValidator";
import { createDefaultValidator } from "../../Validator/ValidatorFactory";
import { HelpUrlBuilder } from "../HelpUrlBuilder";
import { ILogger } from "../Logging/Logger";
import { MarkdownUtils } from "../MarkdownUtils";
import { ReferencesService } from "../ReferencesService";
import { ISettings } from "../Settings/ISettings";

import { SugarProjectIntellisenseService } from "./SugarProjectIntellisenseService";
import { SugarProjectIntellisenseServiceCollection } from "./SugarProjectIntellisenseServiceCollection";

export interface IDocumentOffsetPositionResolver {
    offsetAt(position: Position): number;
    positionAt(offset: number): Position;
}

export class SugarDocumentIntellisenseService {
    private readonly logger: ILogger;
    private readonly validator: SugarValidator;
    private readonly documentUri: string;
    private readonly offsetPositionResolver: IDocumentOffsetPositionResolver;
    private readonly suggester: CompletionSuggester;
    private readonly builder: OffsetToNodeMapBuilder;
    private readonly sugarElements: SugarElementInfo[];
    private readonly helpUrlBuilder: HelpUrlBuilder;
    private readonly sugarProject: SugarProjectIntellisenseService;
    private readonly referencesService: ReferencesService;
    private offsetToNodeMap?: OffsetToNodeMap;
    private updateDomListeners: Array<() => void> = [];
    private readonly settings: ISettings;

    public sendValidationsEvent = createEvent<[Diagnostic[]]>();
    public schemaChangedEvent = createEvent<[string]>();
    public readonly updateDomDebounced = _.debounce((text: string) => this.updateDom(text), 50, { trailing: true });

    public constructor(
        logger: ILogger,
        documentUri: string,
        offsetPositionResolver: IDocumentOffsetPositionResolver,
        sugarProjects: SugarProjectIntellisenseServiceCollection,
        settings: ISettings
    ) {
        this.settings = settings;
        this.sugarProject = sugarProjects.getOrCreateServiceBySugarFileUri(documentUri);
        this.sugarProject.dataSchemaChangeEvent.addListener(this.handleChangeDataSchema);
        this.documentUri = documentUri;
        this.logger = logger;
        this.offsetPositionResolver = offsetPositionResolver;
        this.suggester = new CompletionSuggester(
            [],
            standardElements,
            this.sugarProject.userDefinedTemplateElements,
            this.sugarProject.getDataSchema()
        );
        this.sugarElements = this.sugarProject.getSugarElementInfos();
        this.validator = createDefaultValidator(this.sugarProject);
        this.builder = new OffsetToNodeMapBuilder();
        this.helpUrlBuilder = new HelpUrlBuilder(sugarElementsGroups);
        this.referencesService = new ReferencesService(this.sugarProject, this.documentUri);
    }

    public async reformatDocument(text: string): Promise<string | undefined> {
        try {
            const formatter = new SugarFormatter(
                ValidCodeStyleRule.getSugarFormatterOptionsFromValidatorSettings(
                    await SettingsResolver.resolveSettings(UriUtils.toFileName(this.documentUri))
                )
            );
            return formatter.format(text);
        } catch (ignoreError) {
            return undefined;
        }
    }

    private get dataSchema(): DataSchemaElementNode {
        return this.sugarProject.getDataSchema();
    }

    public async getCodeLenses(): Promise<undefined | CodeLens[]> {
        if (!(await this.settings.getShowTypeUsageInfoAsCodeLens())) {
            return undefined;
        }
        return this.referencesService.getAllCodeLenses();
    }

    public handleCloseTextDocument({ document }: TextDocumentChangeEvent): void {
        this.logger.info(`Send empty diagnostics for closed file. (${document.uri})`);
        this.sugarProject.dataSchemaChangeEvent.removeListener(this.handleChangeDataSchema);
        this.sendEmptyValidations();
    }

    public async validateTextDocument(text: string): Promise<void> {
        this.logger.info(`Begin document validation. (${this.documentUri})`);
        const validationResults = this.validator.validate(
            text,
            await SettingsResolver.resolveSettings(UriUtils.toFileName(this.documentUri))
        );
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

    public async processChangeDocumentContent(text: string): Promise<void> {
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
        return this.referencesService.findAllReferences(context);
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
                const userDefinedTypes = this.sugarProject.userDefinedTypes;
                if (userDefinedTypes != undefined) {
                    const userDefinedTypeInfo = userDefinedTypes.find(x => x.name === typeName);
                    if (userDefinedTypeInfo != undefined) {
                        let documentationText = "";
                        if (userDefinedTypeInfo != undefined) {
                            documentationText += "```xml\n";
                            documentationText += `<type name="${userDefinedTypeInfo.name}" />\n`;
                            documentationText += "```\n";
                        }
                        if (userDefinedTypeInfo.description != undefined) {
                            documentationText += userDefinedTypeInfo.description + "\n";
                        } else {
                            documentationText += "\n\n";
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
        const userDefinedTypes = this.sugarProject.userDefinedTypes;
        if (
            context.type === "AttributeValue" &&
            userDefinedTypes != undefined &&
            context.currentAttributeInfo != undefined &&
            context.currentAttributeInfo.valueTypes.includes(AttributeType.Type)
        ) {
            const userDefinedTypeInfo = userDefinedTypes.find(x => x.name === context.contextNode.value);
            if (userDefinedTypeInfo == undefined || userDefinedTypeInfo.absoluteSugarFilePath == undefined) {
                return undefined;
            }
            return {
                range: this.pegjsPositionToVsCodeRange(userDefinedTypeInfo.position),
                uri: UriUtils.fileNameToUri(userDefinedTypeInfo.absoluteSugarFilePath),
            };
        }
        const userDefinedTemplates = this.sugarProject.userDefinedTemplateSource;
        if (context.type === "ElementName" && userDefinedTemplates != undefined) {
            const userDefinedTypeInfo = userDefinedTemplates.find(x => x.name === context.contextNode.value);
            if (userDefinedTypeInfo == undefined || userDefinedTypeInfo.absoluteSugarFilePath == undefined) {
                return undefined;
            }
            return {
                range: this.pegjsPositionToVsCodeRange(userDefinedTypeInfo.position),
                uri: UriUtils.fileNameToUri(userDefinedTypeInfo.absoluteSugarFilePath),
            };
        }
        if (context.type === "DataAttributeValue" && context.currentDataContext != undefined) {
            const dataNode = this.getDataElementOrAttributeByPath(context.currentDataContext);
            if (dataNode == undefined) {
                return undefined;
            }
            return {
                range: this.pegjsPositionToVsCodeRange(dataNode.position),
                uri: UriUtils.fileNameToUri(this.sugarProject.getSchemaFileName()),
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
            const elementInfo = this.sugarProject.getSugarElementInfos().find(x => x.name === suggestionItem.name);

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
            const elementInfo = this.sugarProject
                .getSugarElementInfos()
                .find(x => x.name === suggestionItem.parentElementName);
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
            const dataSchemaNode = DataSchemaUtils.findElementByPath(this.dataSchema, suggestionItem.fullPath);
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
            const dataSchemaAttribute = DataSchemaUtils.findAttributeByPath(this.dataSchema, suggestionItem.fullPath);
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
        const userDefinedTypes = this.sugarProject.userDefinedTypes;
        if (suggestionItem.type === SuggestionItemType.Type && userDefinedTypes != undefined) {
            const userDefinedTypeInfo = userDefinedTypes.find(x => x.name === suggestionItem.name);
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

    private readonly handleChangeDataSchema = (dataSchema: DataSchemaElementNode): void => {
        this.suggester.updateDataSchema(dataSchema);
        this.schemaChangedEvent.emit(this.documentUri);
    };

    private updateDom(text: string): void {
        this.logger.info("Begin update");
        try {
            const sugarDocument = this.builder.buildCodeDom(text);
            this.offsetToNodeMap = this.builder.buildOffsetToNodeMapFromDom(sugarDocument);
            this.sugarProject.updateDocumentDom(this.documentUri, sugarDocument);
            this.suggester.updateUserDefinedSugarType(this.sugarProject.userDefinedTypes);
            this.suggester.updateUserDefinedSugarInfos(this.sugarProject.userDefinedTemplateElements);
            this.referencesService.buildAllUsages();
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
        return DataSchemaUtils.findSchemaNodeByPath(this.dataSchema, path);
    }

    private resolveContextAsOffset(offset: number): undefined | CodeContext {
        if (this.offsetToNodeMap == undefined) {
            return undefined;
        }
        const contextAtCursorResolver = new CodeContextByNodeResolver(
            this.sugarElements,
            this.sugarProject.userDefinedTemplateElements
        );
        const node = this.offsetToNodeMap.getNodeByOffset(offset);
        if (node == undefined) {
            return undefined;
        }
        return contextAtCursorResolver.resolveContext(node);
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
