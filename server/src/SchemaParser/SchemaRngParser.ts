import xmlParser, { X2jOptionsOptional } from "fast-xml-parser";

import { DataSchemaAttribute, DataSchemaNode } from "../Suggester/DataSchemaNode";
import { isNotNullOrUndefined } from "../Utils/TypingUtils";

export class SchemaRngParser {
    public constructor() {}
    public toDataSchema(xmlSchemaFileContent: string): DataSchemaNode {
        const options: X2jOptionsOptional = {
            attributeNamePrefix: "",
            attrNodeName: "properties",
            textNodeName: "#text",
            ignoreAttributes: false,
            ignoreNameSpace: false,
            allowBooleanAttributes: false,
            parseNodeValue: true,
            parseAttributeValue: false,
            trimValues: true,
            cdataTagName: false,
            cdataPositionChar: "\\c",
            localeRange: "",
            parseTrueNumberOnly: false,
            attrValueProcessor: a => a,
            tagValueProcessor: a => a,
        };
        const traversalResult = xmlParser.getTraversalObj(xmlSchemaFileContent, options);
        const xmlSchemaAsJson = xmlParser.convertToJson(traversalResult, options);

        return this.createDataSchemaNode(xmlSchemaAsJson);
    }

    private createDataSchemaNode(xmlSchemaAsJson: JSONXMLSchemeNode): DataSchemaNode {
        const properties = xmlSchemaAsJson.properties || {};
        const elementName = properties.name;
        return {
            name: elementName || "",
            multiple: properties.multiple === "true",
            attributes: this.buildElementAttributes(this.normalizeSingleNode(xmlSchemaAsJson.attribute)),
            children: [
                ...this.buildChildren(this.normalizeSingleNode(xmlSchemaAsJson.element)),
                ...this.normalizeSingleNode(xmlSchemaAsJson.choice)
                    .map(x => this.buildChildren(this.normalizeSingleNode(x.element)))
                    .reduce((x, y) => x.concat(y), []),
            ],
        };
    }

    private normalizeSingleNode<T>(element: undefined | T | T[]): T[] {
        if (element == undefined) {
            return [];
        }
        if (!Array.isArray(element)) {
            return [element];
        }
        return element;
    }

    private buildChildren(nodes: JSONXMLSchemeNode[]): DataSchemaNode[] {
        return nodes.map(x => this.createDataSchemaNode(x));
    }

    private buildElementAttributes(nodes: JSONXMLSchemeNode[]): DataSchemaAttribute[] {
        return nodes
            .map(x => (x.properties || {}).name)
            .filter(isNotNullOrUndefined)
            .map(x => ({ name: x }));
    }
}

interface JSONXMLSchemeAttributeTypeNode {
    properties?: { [key: string]: string };
}

interface JSONXMLSchemeAttributeNode {
    properties?: { [key: string]: string };
    type: JSONXMLSchemeAttributeTypeNode;
}

interface JSONXMLSchemeChoiceNode {
    element?: JSONXMLSchemeNode | JSONXMLSchemeNode[];
}

interface JSONXMLSchemeNode {
    properties?: { [key: string]: string };
    attribute?: JSONXMLSchemeAttributeNode | JSONXMLSchemeAttributeNode[];
    element?: JSONXMLSchemeNode | JSONXMLSchemeNode[];
    choice?: JSONXMLSchemeChoiceNode | JSONXMLSchemeChoiceNode[];
}
