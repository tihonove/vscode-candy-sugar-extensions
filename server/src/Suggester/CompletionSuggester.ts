import { CompletionContext, ExpectedToken, getCompletionContext } from "./ComletionClassificator";
import { DataAttributeSuggester } from "./DataAttributeSuggester";
import { DataSchemaNode } from "./DataSchemaNode";
import { AttributeType, SugarAttributeInfo, SugarElementInfo } from "./SugarElementInfo";
import { SugarTypeInfo } from "./SugarTypeInfo";

export interface Suggestions {
    items: SuggestionItem[];
}

export enum SuggestionItemType {
    Element,
    Attribute,
    DataElement,
    DataAttribute,
}

export interface SuggestionItem {
    type: SuggestionItemType;
    name: string;
}

export class CompletionSuggester {
    private readonly sugarElementInfos: SugarElementInfo[];
    private sugarTypes: SugarTypeInfo[];
    private dataSchemaRoot: DataSchemaNode;
    private dataAttributeSuggester: DataAttributeSuggester;

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
        const emptyResult = { items: [] };
        if (context == undefined) {
            return emptyResult;
        }
        if (context.expectedToken === ExpectedToken.ElementName) {
            return {
                items: this.sugarElementInfos.map(x => ({
                    type: SuggestionItemType.Element,
                    name: x.name,
                })),
            };
        }
        if (context.expectedToken === ExpectedToken.AttributeName) {
            const currentElementInfo = this.getElementInfoByContext(context);
            if (currentElementInfo == undefined || currentElementInfo.attributes == undefined) {
                return emptyResult;
            }
            return {
                items: currentElementInfo.attributes.map(x => ({
                    type: SuggestionItemType.Attribute,
                    name: x.name,
                })),
            };
        }
        if (context.expectedToken === ExpectedToken.AttributeValueContent) {
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
            const contextualRoot = this.dataAttributeSuggester.findCurrentRootByContext(this.dataSchemaRoot, context);
            result = result.concat(
                this.dataAttributeSuggester.suggest(
                    contextualRoot || this.dataSchemaRoot,
                    (context.attributeContext && context.attributeContext.attributeValue) || ""
                )
            );
        }
        return result;
    }
}
