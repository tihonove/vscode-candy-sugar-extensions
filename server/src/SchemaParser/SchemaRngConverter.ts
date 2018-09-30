import { DataSchemaAttribute, DataSchemaNode } from "../Suggester/DataSchemaNode";
import { isNotNullOrUndefined } from "../Utils/TypingUtils";

import { parse, SchemaRngNode } from "./SchemaRngGrammar/SchemaRngParser";

export class SchemaRngConverter {
    public toDataSchema(xmlSchemaFileContent: string): DataSchemaNode {
        const parseResult = parse(xmlSchemaFileContent.replace(/^\uFEFF/, ""));
        return {
            name: "",
            children: [this.createDataSchemaNode(parseResult.body)],
        };
    }

    private createDataSchemaNode(xmlSchemaAsJson: SchemaRngNode): DataSchemaNode {
        const properties = xmlSchemaAsJson.attributes || {};
        const elementName = properties.name;
        return {
            name: elementName || "",
            multiple: properties.multiple === "true",
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

    private buildChildren(nodes: SchemaRngNode[]): DataSchemaNode[] {
        return nodes.map(x => this.createDataSchemaNode(x));
    }

    private buildElementAttributes(nodes: SchemaRngNode[]): DataSchemaAttribute[] {
        return nodes
            .map(x => (x.attributes || {}).name)
            .filter(isNotNullOrUndefined)
            .map(x => ({ name: x }));
    }
}
