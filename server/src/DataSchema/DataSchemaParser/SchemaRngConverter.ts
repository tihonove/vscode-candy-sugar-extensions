import { isNotNullOrUndefined, valueOrDefault } from "../../Utils/TypingUtils";
import { DataSchemaAttribute, DataSchemaElementNode } from "../DataSchemaNode";

import { parse, SchemaRngNode, SchemaRngNodeAttributeList } from "./SchemaRngGrammar/SchemaRngParser";

export class SchemaRngConverter {
    public toDataSchema(xmlSchemaFileContent: string): DataSchemaElementNode {
        const parseResult = parse(xmlSchemaFileContent.replace(/^\uFEFF/, ""));
        return {
            name: "",
            type: "DataSchemaElementNode",
            children: [this.createDataSchemaNode(parseResult.body)],
            position: parseResult.position,
        };
    }

    private createDataSchemaNode(xmlSchemaAsJson: SchemaRngNode): DataSchemaElementNode {
        const properties = xmlSchemaAsJson.attributes != undefined ? xmlSchemaAsJson.attributes : {};
        const elementName = properties.name;
        return {
            type: "DataSchemaElementNode",
            name: elementName != undefined ? elementName : "",
            multiple: properties.multiple === "true",
            position: xmlSchemaAsJson.position,
            description: properties.description,
            attributes: this.buildElementAttributes(
                this.normalizeSingleNode(xmlSchemaAsJson.children).filter(x => x.name === "attribute")
            ),
            children: [
                ...this.buildChildren(
                    this.normalizeSingleNode(xmlSchemaAsJson.children).filter(x => x.name === "element")
                ),
                ...this.normalizeSingleNode(xmlSchemaAsJson.children)
                    .filter(x => x.name === "choice")
                    .map(x =>
                        this.buildChildren(this.normalizeSingleNode(x.children).filter(x => x.name === "element"))
                    )
                    .reduce((x, y) => x.concat(y), []),
            ],
        };
    }

    private normalizeSingleNode<T>(element: undefined | T[]): T[] {
        if (element == undefined) {
            return [];
        }
        return element;
    }

    private buildChildren(nodes: SchemaRngNode[]): DataSchemaElementNode[] {
        return nodes.map(x => this.createDataSchemaNode(x));
    }

    private buildElementAttributes(nodes: SchemaRngNode[]): DataSchemaAttribute[] {
        return nodes.map(x => this.buildElementAttribute(x)).filter(isNotNullOrUndefined);
    }

    private buildElementAttribute(node: SchemaRngNode): undefined | DataSchemaAttribute {
        const attributeList = valueOrDefault<SchemaRngNodeAttributeList>(node.attributes, {});
        if (attributeList == undefined || attributeList.name == undefined) {
            return undefined;
        }
        return {
            type: "DataSchemaAttribute",
            name: attributeList.name,
            description: attributeList.description,
            position: node.position,
        };
    }
}
