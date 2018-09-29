import { SuggestionItem, SuggestionItemType } from "./CompletionSuggester";
import { DataSchemaNode } from "./DataSchemaNode";

export class DataAttributeSuggester {
    private readonly pathSeparator: string = "/";

    public suggest(root: DataSchemaNode, dataPathToCursor: string): SuggestionItem[] {
        const pathItems = dataPathToCursor.split(this.pathSeparator);
        const itemsWithoutLastItem = pathItems.slice(0, -1);
        const element = this.findElementByPath(root, itemsWithoutLastItem);
        if (element == undefined) {
            return [];
        }
        return [
            ...(element.children || []).map(x => ({ type: SuggestionItemType.DataElement, name: x.name })),
            ...(element.attributes || []).map(x => ({ type: SuggestionItemType.DataAttribute, name: x.name })),
        ];
    }

    private findElementByPath(root: DataSchemaNode, itemsWithoutLastItem: string[]): undefined | DataSchemaNode {
        if (itemsWithoutLastItem.length === 0) {
            return root;
        } else {
            const nextNode =
                root.children != undefined ? root.children.find(x => x.name === itemsWithoutLastItem[0]) : undefined;
            if (nextNode == undefined) {
                return undefined;
            }
            return this.findElementByPath(nextNode, itemsWithoutLastItem.slice(1));
        }
    }
}
