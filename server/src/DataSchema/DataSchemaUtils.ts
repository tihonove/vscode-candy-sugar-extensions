import { DataSchemaAttribute, DataSchemaElementNode, DataSchemaNode } from "./DataSchemaNode";

export class DataSchemaUtils {
    public static findElementByPath(root: DataSchemaElementNode, path: string[]): undefined | DataSchemaElementNode {
        const itemsWithoutLastItem = this.normalizeDataPath(path);
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

    public static findAttributeByPath(root: DataSchemaElementNode, path: string[]): undefined | DataSchemaAttribute {
        const itemsWithoutLastItem = this.normalizeDataPath(path);
        const element = this.findElementByPath(root, itemsWithoutLastItem.slice(0, -1));
        if (element == undefined || element.attributes == undefined) {
            return undefined;
        }
        const attribute = element.attributes.find(
            x => x.name === itemsWithoutLastItem[itemsWithoutLastItem.length - 1]
        );
        return attribute;
    }

    public static joinDataPaths(prefix: string[], ...suffixes: string[][]): string[] {
        let result = prefix;
        for (const suffix of suffixes) {
            if (suffix.length > 0 && suffix[0] === "") {
                result = suffix;
            } else {
                result = [...result, ...suffix];
            }
        }
        return result;
    }

    public static parseDataAttributeValue(pathAttributeValue: string): string[] {
        return pathAttributeValue.split("/");
    }

    public static findSchemaNodeByPath(root: DataSchemaElementNode, path: string[]): undefined | DataSchemaNode {
        const normalizedPath = this.normalizeDataPath(path);
        const element = DataSchemaUtils.findElementByPath(root, normalizedPath);
        const attribute = DataSchemaUtils.findAttributeByPath(root, normalizedPath);
        return element || attribute;
    }

    public static normalizeDataPath(path: string[]): string[] {
        // TODO надо сделать этот метод приватным или вообще как-то надо Path сделать объектом
        return path.length > 0 && path[0] === "" ? path.slice(1) : path;
    }
}
