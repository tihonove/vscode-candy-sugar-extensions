import { DataSchemaNode } from "../DataSchema/DataSchemaNode";
import { valueOrDefault } from "../Utils/TypingUtils";

import { CompletionContext, getCompletionContext } from "./CompletionClassificator/CompletionClassificator";
import { DataAttributeSuggester } from "./DataAttributeSuggester";
import { AttributeType, SugarAttributeInfo, SugarElementInfo } from "./SugarElementInfo";
import { SugarTypeInfo } from "./SugarTypeInfo";
import { ExpectedTokenType } from "./CompletionClassificator/ExpectedTokenType";

export interface Suggestions {
    items: SuggestionItem[];
}

export enum SuggestionItemType {
    Element,
    Attribute,
    DataElement,
    DataAttribute,
}

export type SuggestionItem =
    | {
          type: SuggestionItemType.Element;
          name: string;
      }
    | {
          type: SuggestionItemType.DataElement;
          name: string;
          fullPath: string[];
      }
    | {
          type: SuggestionItemType.DataAttribute;
          name: string;
          fullPath: string[];
      }
    | {
          type: SuggestionItemType.Attribute;
          name: string;
          parentElementName: string;
      };

export class CompletionSuggester {
    private readonly sugarElementInfos: SugarElementInfo[];
    private readonly sugarTypes: SugarTypeInfo[];
    private readonly dataSchemaRoot: DataSchemaNode;
    private readonly dataAttributeSuggester: DataAttributeSuggester;

    public constructor(
        sugarTypes: SugarTypeInfo[],
        sugarElementInfos: SugarElementInfo[],
        dataSchemaRoot: DataSchemaNode
    ) {
        this.sugarTypes = sugarTypes;
        this.sugarElementInfos = sugarElementInfos;
        this.dataSchemaRoot = dataSchemaRoot;
        this.dataAttributeSuggester = new DataAttributeSuggester(sugarElementInfos);
    }

    public suggest(codeBeforeCursor: string): Suggestions {
        const context = getCompletionContext(codeBeforeCursor);
        const emptyResult: Suggestions = { items: [] };
        if (context == undefined) {
            return emptyResult;
        }
        if (context.expectedToken === ExpectedTokenType.ElementName) {
            return {
                items: this.sugarElementInfos.map<SuggestionItem>(x => ({
                    type: SuggestionItemType.Element,
                    name: x.name,
                })),
            };
        }
        if (context.expectedToken === ExpectedTokenType.AttributeName) {
            const currentElementInfo = this.getElementInfoByContext(context);
            if (currentElementInfo == undefined || currentElementInfo.attributes == undefined) {
                return emptyResult;
            }
            return {
                items: currentElementInfo.attributes.map<SuggestionItem>(x => ({
                    type: SuggestionItemType.Attribute,
                    name: x.name,
                    parentElementName: currentElementInfo.name,
                })),
            };
        }
        if (context.expectedToken === ExpectedTokenType.AttributeValueContent) {
            return {
                items: this.suggestAttributeValue(context),
            };
        }
        return emptyResult;
    }

    private getElementInfoByContext(context: CompletionContext): undefined | SugarElementInfo {
        const elementContext = context.elementContext;
        if (elementContext == undefined) {
            return undefined;
        }
        return this.sugarElementInfos.find(x => x.name === elementContext.elementName);
    }

    private getAttributeInfoByContext(
        context: CompletionContext
    ): [undefined, undefined] | [SugarElementInfo, SugarAttributeInfo] {
        const element = this.getElementInfoByContext(context);
        if (element == undefined || element.attributes == undefined) {
            return [undefined, undefined];
        }
        const attributeContext = context.attributeContext;
        if (attributeContext == undefined) {
            return [undefined, undefined];
        }
        const attribute = element.attributes.find(x => x.name === attributeContext.attributeName);
        if (attribute == undefined) {
            return [undefined, undefined];
        }
        return [element, attribute];
    }

    private suggestAttributeValue(context: CompletionContext): SuggestionItem[] {
        const [element, attribute] = this.getAttributeInfoByContext(context);
        if (element == undefined || attribute == undefined || context.attributeContext == undefined) {
            return [];
        }
        let result: SuggestionItem[] = [];
        if (attribute.valueTypes.includes(AttributeType.Path)) {
            const scopingPath = this.dataAttributeSuggester.getScopePathByContext(this.dataSchemaRoot, context);
            const contextualRoot = this.dataAttributeSuggester.findCurrentRootByContext(this.dataSchemaRoot, context);
            result = result.concat(
                this.dataAttributeSuggester.suggest(
                    scopingPath,
                    valueOrDefault(contextualRoot, this.dataSchemaRoot),
                    valueOrDefault<string>(
                        context.attributeContext != undefined ? context.attributeContext.attributeValue : undefined,
                        ""
                    )
                )
            );
        }
        return result;
    }
}
