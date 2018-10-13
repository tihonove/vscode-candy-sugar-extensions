import { DataPath, DataPathUtils } from "./DataPathUtils";
import { DataSchemaAttribute, DataSchemaElementNode, DataSchemaNode } from "./DataSchemaNode";

export class DataSchemaUtils {
    public static findElementByPath(root: DataSchemaElementNode, path: DataPath): undefined | DataSchemaElementNode {
        const itemsWithoutLastItem = DataPathUtils.normalizeDataPath(path);
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

    public static findAttributeByPath(root: DataSchemaElementNode, path: DataPath): undefined | DataSchemaAttribute {
        const itemsWithoutLastItem = DataPathUtils.normalizeDataPath(path);
        const element = this.findElementByPath(root, itemsWithoutLastItem.slice(0, -1));
        if (element == undefined || element.attributes == undefined) {
            return undefined;
        }
        const attribute = element.attributes.find(
            x => x.name === itemsWithoutLastItem[itemsWithoutLastItem.length - 1]
        );
        return attribute;
    }

    public static findSchemaNodeByPath(root: DataSchemaElementNode, path: DataPath): undefined | DataSchemaNode {
        const normalizedPath = DataPathUtils.normalizeDataPath(path);
        const element = DataSchemaUtils.findElementByPath(root, normalizedPath);
        const attribute = DataSchemaUtils.findAttributeByPath(root, normalizedPath);
        return element || attribute;
    }
}
