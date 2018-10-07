import { DataSchemaAttribute, DataSchemaElementNode } from "./DataSchemaNode";

export class DataSchemaUtils {
    public static findElementByPath(root: DataSchemaElementNode, itemsWithoutLastItem: string[]): undefined | DataSchemaElementNode {
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

    public static findAttributeByPath(
        root: DataSchemaElementNode,
        itemsWithoutLastItem: string[]
    ): undefined | DataSchemaAttribute {
        const element = this.findElementByPath(root, itemsWithoutLastItem.slice(0, -1));
        if (element == undefined || element.attributes == undefined) {
            return undefined;
        }
        const attribute = element.attributes.find(
            x => x.name === itemsWithoutLastItem[itemsWithoutLastItem.length - 1]
        );
        return attribute;
    }
}
