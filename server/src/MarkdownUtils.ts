import { MarkupContent, MarkupKind } from "vscode-languageserver-types";

import { DataSchemaAttribute, DataSchemaElementNode } from "./DataSchema/DataSchemaNode";
import { AttributeType, SugarAttributeInfo, SugarElementInfo } from "./Suggester/SugarElementInfo";
import { isNotNullOrUndefined } from "./Utils/TypingUtils";

interface ElementDetailsOptions {
    appendHeader?: boolean;
}

export class MarkdownUtils {
    public static buildDataSchemaElementDetail(
        _currentElementInfo: SugarElementInfo | undefined,
        _currentAttributeInfo: SugarAttributeInfo | undefined,
        dataSchemaNode: DataSchemaElementNode,
        options: ElementDetailsOptions
    ): undefined | MarkupContent {
        const header = [
            "```xml",
            dataSchemaNode.multiple
                ? `<element name="${dataSchemaNode.name}">`
                : `<element name="${dataSchemaNode.name}" multiple="true">`,
            "```",
        ];
        return {
            kind: MarkupKind.Markdown,
            value: [...(options.appendHeader ? header : []), dataSchemaNode.description].join("\n"),
        };
    }
    public static buildDataSchemaAttributeDetail(
        _currentElementInfo: SugarElementInfo | undefined,
        _currentAttributeInfo: SugarAttributeInfo | undefined,
        dataSchemaNode: DataSchemaAttribute,
        options: ElementDetailsOptions
    ): undefined | MarkupContent {
        const header = ["```xml", `<attribute name="${dataSchemaNode.name}">`, "```"];
        return {
            kind: MarkupKind.Markdown,
            value: [...(options.appendHeader ? header : []), dataSchemaNode.description].join("\n"),
        };
    }
    public static buildAttributeHeader(currentAttributeInfo: SugarAttributeInfo): string {
        return `${currentAttributeInfo.name}="${currentAttributeInfo.valueTypes
            .map(x => `[${this.valueTypeToString(x)}]`)
            .join(" | ")}"`;
    }

    public static buildAttributeDetails(
        _currentElementInfo: undefined | SugarElementInfo,
        currentAttributeInfo: undefined | SugarAttributeInfo,
        options: ElementDetailsOptions
    ): undefined | MarkupContent {
        if (currentAttributeInfo == undefined) {
            return undefined;
        }
        const headerLines = options.appendHeader
            ? ["```css", this.buildAttributeHeader(currentAttributeInfo), "```", ""]
            : [];
        return {
            kind: MarkupKind.Markdown,
            value: [...headerLines, currentAttributeInfo.markdownDescription].filter(isNotNullOrUndefined).join("\n"),
        };
    }
    public static buildElementDetails(
        sugarElementInfo: undefined | SugarElementInfo,
        options: ElementDetailsOptions
    ): undefined | MarkupContent {
        if (sugarElementInfo == undefined) {
            return undefined;
        }
        let attributesLines: string[] = [];
        if (sugarElementInfo.attributes != undefined && sugarElementInfo.attributes.length > 0) {
            attributesLines = [
                "",
                "*Атрибуты*",
                ...sugarElementInfo.attributes.map(
                    x => `* \`${x.name}\` ${x.shortMarkdownDescription || x.markdownDescription || ""}`
                ),
            ];
        }
        const headerLines = options.appendHeader ? ["```xml", `<${sugarElementInfo.name}>`, "```"] : [];
        return {
            kind: MarkupKind.Markdown,
            value: [...headerLines, sugarElementInfo.markdownDescription, ...attributesLines]
                .filter(isNotNullOrUndefined)
                .join("\n"),
        };
    }

    public static valueTypeToString(attributeType: AttributeType): string {
        switch (attributeType) {
            case AttributeType.Boolean:
                return "boolean";
                break;
            case AttributeType.Number:
                return "number";
                break;
            case AttributeType.Path:
                return "DataPath";
                break;
            case AttributeType.String:
                return "string";
                break;
            case AttributeType.Type:
                return "Type";
                break;
            default:
                return "any";
                break;
        }
    }
}