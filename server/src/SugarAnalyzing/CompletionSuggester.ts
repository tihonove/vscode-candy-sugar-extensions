import { DataPathUtils } from "../DataSchema/DataPathUtils";
import { DataSchemaAttribute, DataSchemaElementNode } from "../DataSchema/DataSchemaNode";
import { DataSchemaUtils } from "../DataSchema/DataSchemaUtils";
import { SugarElementInfo } from "../SugarElements/SugarElementInfo";
import { SugarTypeInfo } from "../SugarElements/SugarTypeInfo";
import {
    CompletionContext,
    getCompletionContext,
} from "../SugarParsing/CompletionClassificator/CompletionClassificator";
import { ExpectedTokenType } from "../SugarParsing/CompletionClassificator/ExpectedTokenType";
import { valueOrDefault } from "../Utils/TypingUtils";

import { CodeContext } from "./CodeContext";
import { CodeContextByNodeResolver } from "./CodeContextByNodeResolver";

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
    private readonly contextResolver: CodeContextByNodeResolver;

    public constructor(
        sugarTypes: SugarTypeInfo[],
        sugarElementInfos: SugarElementInfo[],
        dataSchemaRoot: DataSchemaElementNode
    ) {
        this.sugarTypes = sugarTypes;
        this.sugarElementInfos = sugarElementInfos;
        this.dataSchemaRoot = dataSchemaRoot;
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
            return this.suggestDataPath(codeContext.dataContext, this.dataSchemaRoot, completionContext.node.value);
        }
        return [];
    }

    private suggestDataPath(
        scopedPath: string[],
        root: DataSchemaElementNode,
        dataPathToCursor: string
    ): SuggestionItem[] {
        const pathItems = DataPathUtils.parseDataAttributeValue(dataPathToCursor);
        const itemsWithoutLastItem = DataPathUtils.joinDataPaths(scopedPath, pathItems.slice(0, -1));
        const element = this.findElementByPath(root, itemsWithoutLastItem);
        if (element == undefined) {
            return [];
        }
        return [
            ...valueOrDefault<DataSchemaElementNode[]>(element.children, []).map<SuggestionItem>(x => ({
                type: SuggestionItemType.DataElement,
                name: x.name,
                fullPath: DataPathUtils.normalizeDataPath(DataPathUtils.joinDataPaths(itemsWithoutLastItem, [x.name])),
            })),
            ...valueOrDefault<DataSchemaAttribute[]>(element.attributes, []).map<SuggestionItem>(x => ({
                type: SuggestionItemType.DataAttribute,
                name: x.name,
                fullPath: DataPathUtils.normalizeDataPath(DataPathUtils.joinDataPaths(itemsWithoutLastItem, [x.name])),
            })),
        ];
    }

    private findElementByPath(
        root: DataSchemaElementNode,
        itemsWithoutLastItem: string[]
    ): undefined | DataSchemaElementNode {
        return DataSchemaUtils.findElementByPath(root, itemsWithoutLastItem);
    }
}
