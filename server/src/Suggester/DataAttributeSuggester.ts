import { DataPathUtils } from "../DataSchema/DataPathUtils";
import { DataSchemaAttribute, DataSchemaElementNode } from "../DataSchema/DataSchemaNode";
import { DataSchemaUtils } from "../DataSchema/DataSchemaUtils";
import { valueOrDefault } from "../Utils/TypingUtils";

import { SuggestionItem, SuggestionItemType } from "./CompletionSuggester";

export class DataAttributeSuggester {
    public suggest(scopedPath: string[], root: DataSchemaElementNode, dataPathToCursor: string): SuggestionItem[] {
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
