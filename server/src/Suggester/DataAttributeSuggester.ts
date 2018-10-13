import { DataSchemaAttribute, DataSchemaElementNode } from "../DataSchema/DataSchemaNode";
import { DataSchemaUtils } from "../DataSchema/DataSchemaUtils";
import { isNotNullOrUndefined, valueOrDefault } from "../Utils/TypingUtils";

import { CompletionContext, ElementContext } from "./CompletionClassificator/CompletionClassificator";
import { SuggestionItem, SuggestionItemType } from "./CompletionSuggester";
import { SugarElementInfo } from "./SugarElementInfo";

export class DataAttributeSuggester {
    private readonly sugarElementInfos: SugarElementInfo[];

    public constructor(sugarElementInfos: SugarElementInfo[]) {
        this.sugarElementInfos = sugarElementInfos;
    }

    public getScopePathByContext(context: CompletionContext): string[] {
        if (context.elementContextStack == undefined) {
            return [];
        }
        const elementInfosStack: Array<[SugarElementInfo, ElementContext]> = context.elementContextStack
            .slice(0, -1)
            .map<[undefined | SugarElementInfo, ElementContext]>(x => [this.getElementInfoByContext(x), x])
            .map<undefined | [SugarElementInfo, ElementContext]>(([elementInfo, elementContext]) => {
                if (elementInfo == undefined) {
                    return undefined;
                }
                return [elementInfo, elementContext];
            })
            .filter(isNotNullOrUndefined);

        let result: string[] = [];
        for (const [elementInfo, elementContext] of elementInfosStack) {
            const scopingPath = this.getScopingPath(elementInfo, elementContext);
            if (scopingPath != undefined) {
                result = DataSchemaUtils.joinDataPaths(result, DataSchemaUtils.parseDataAttributeValue(scopingPath));
            }
        }
        return result;
    }

    public suggest(scopedPath: string[], root: DataSchemaElementNode, dataPathToCursor: string): SuggestionItem[] {
        const pathItems = DataSchemaUtils.parseDataAttributeValue(dataPathToCursor);
        const itemsWithoutLastItem = DataSchemaUtils.joinDataPaths(scopedPath, pathItems.slice(0, -1));
        const element = this.findElementByPath(root, itemsWithoutLastItem);
        if (element == undefined) {
            return [];
        }
        return [
            ...valueOrDefault<DataSchemaElementNode[]>(element.children, []).map<SuggestionItem>(x => ({
                type: SuggestionItemType.DataElement,
                name: x.name,
                fullPath: DataSchemaUtils.normalizeDataPath(
                    DataSchemaUtils.joinDataPaths(itemsWithoutLastItem, [x.name])
                ),
            })),
            ...valueOrDefault<DataSchemaAttribute[]>(element.attributes, []).map<SuggestionItem>(x => ({
                type: SuggestionItemType.DataAttribute,
                name: x.name,
                fullPath: DataSchemaUtils.normalizeDataPath(
                    DataSchemaUtils.joinDataPaths(itemsWithoutLastItem, [x.name])
                ),
            })),
        ];
    }

    private getScopingPath(elementInfo: SugarElementInfo, elementContext: ElementContext): undefined | string {
        if (!Boolean(elementInfo.createPathScope)) {
            return undefined;
        }
        if (elementContext.attributes == undefined) {
            return undefined;
        }
        const pathAttribute = elementContext.attributes.find(x => x.attributeName === "path");
        if (pathAttribute == undefined) {
            return undefined;
        }
        return pathAttribute.attributeValue;
    }

    private getElementInfoByContext(elementContext: ElementContext): undefined | SugarElementInfo {
        return this.sugarElementInfos.find(x => x.name === elementContext.elementName);
    }

    private findElementByPath(
        root: DataSchemaElementNode,
        itemsWithoutLastItem: string[]
    ): undefined | DataSchemaElementNode {
        return DataSchemaUtils.findElementByPath(root, itemsWithoutLastItem);
    }
}
