import { DataSchemaElementNode } from "../DataSchema/DataSchemaNode";
import { CodeContext } from "../SugarCodeDomBuilder/CodeContext";
import { CodeContextByNodeResolver } from "../SugarCodeDomBuilder/CodeContextByNodeResolver";

import { CompletionContext, getCompletionContext } from "./CompletionClassificator/CompletionClassificator";
import { ExpectedTokenType } from "./CompletionClassificator/ExpectedTokenType";
import { DataAttributeSuggester } from "./DataAttributeSuggester";
import { SugarElementInfo } from "./SugarElementInfo";
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
    // @ts-ignore
    private readonly sugarTypes: SugarTypeInfo[];
    private readonly dataSchemaRoot: DataSchemaElementNode;
    private readonly dataAttributeSuggester: DataAttributeSuggester;
    private readonly contextResolver: CodeContextByNodeResolver;

    public constructor(
        sugarTypes: SugarTypeInfo[],
        sugarElementInfos: SugarElementInfo[],
        dataSchemaRoot: DataSchemaElementNode
    ) {
        this.sugarTypes = sugarTypes;
        this.sugarElementInfos = sugarElementInfos;
        this.dataSchemaRoot = dataSchemaRoot;
        this.dataAttributeSuggester = new DataAttributeSuggester();
        this.contextResolver = new CodeContextByNodeResolver(this.sugarElementInfos);
    }

    public suggest(codeBeforeCursor: string): Suggestions {
        const emptyResult: Suggestions = { items: [] };
        const completionContext = getCompletionContext(codeBeforeCursor);
        if (completionContext == undefined) {
            return emptyResult;
        }
        const codeContext = this.contextResolver.resolveContext(completionContext.node);
        if (codeContext == undefined) {
            return emptyResult;
        }

        if (completionContext == undefined) {
            return emptyResult;
        }
        if (completionContext.expectedToken === ExpectedTokenType.ElementName) {
            return {
                items: this.sugarElementInfos.map<SuggestionItem>(x => ({
                    type: SuggestionItemType.Element,
                    name: x.name,
                })),
            };
        }
        if (completionContext.expectedToken === ExpectedTokenType.AttributeName) {
            const currentElementInfo = codeContext.currentElementInfo;
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
        if (completionContext.expectedToken === ExpectedTokenType.AttributeValueContent) {
            return {
                items: this.suggestAttributeValue(completionContext, codeContext),
            };
        }
        return emptyResult;
    }

    private suggestAttributeValue(completionContext: CompletionContext, codeContext: CodeContext): SuggestionItem[] {
        if (codeContext === undefined) {
            return [];
        }
        if (
            codeContext.type === "DataAttributeValue" &&
            completionContext.expectedToken === ExpectedTokenType.AttributeValueContent
        ) {
            return this.dataAttributeSuggester.suggest(
                codeContext.dataContext,
                this.dataSchemaRoot,
                completionContext.node.value
            );
        }
        return [];

        // let result: SuggestionItem[] = [];
        // if (attribute.valueTypes.includes(AttributeType.Path)) {
        //     const scopingPath = this.dataAttributeSuggester.getScopePathByContext(completionContext);
        //     result = result.concat(
        //         this.dataAttributeSuggester.suggest(
        //             scopingPath,
        //             this.dataSchemaRoot,
        //             valueOrDefault<string>(
        //                 completionContext.attributeContext != undefined
        //                     ? completionContext.attributeContext.attributeValue
        //                     : undefined,
        //                 ""
        //             )
        //         )
        //     );
        // }
        // return result;
    }
}
