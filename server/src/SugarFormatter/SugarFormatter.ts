import { OffsetToNodeMapBuilder } from "../SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import {
    SugarAttribute,
    SugarAttributeJSLiteralValue,
    SugarComment,
    SugarElement,
    SugarJavaScriptLiteral,
    SugarJavaScriptObjectLiteralProperty,
    SugarText,
} from "../SugarParsing/SugarGrammar/SugarParser";
import { isNotNullOrUndefined } from "../Utils/TypingUtils";

interface SugarFormatterOptions {
    tabs: number;
    maxLength: number;
}

interface FormattingResult {
    inline?: string;
    regular: string;
}

export class SugarFormatter {
    private readonly options: SugarFormatterOptions;

    public constructor(options: SugarFormatterOptions) {
        this.options = options;
    }

    public format(input: string): string {
        const builder = new OffsetToNodeMapBuilder();
        const rootElement = builder.buildCodeDom(input);
        return this.removeEmptyLines(this.formatElement(rootElement, this.options.maxLength)) + "\n";
    }

    private formatElement(element: SugarElement, maxLength: number): string {
        const { inline: inlineChildren, regular: regularChildren } = this.formatChildren(
            element.children,
            maxLength - this.options.tabs
        );
        const attributes = element.attributes || [];
        const { inline: inlineAttributes, regular: regularAttributes } = this.formatAttributeList(
            attributes,
            maxLength - this.options.tabs
        );
        const inlineAttributesWithSpace =
            inlineAttributes == undefined || inlineAttributes === "" ? inlineAttributes : " " + inlineAttributes;
        const indentedRegularAttributes =
            regularAttributes === "" ? regularAttributes : "\n" + this.indentText(regularAttributes, 1);
        const name = element.name.value;
        if (inlineChildren === "" && regularChildren === "") {
            if (attributes.length === 0) {
                return `<${name} />`;
            }
            return this.miniMax(
                [
                    inlineAttributesWithSpace != undefined ? `<${name}${inlineAttributesWithSpace} />` : undefined,
                    `<${name}${indentedRegularAttributes}\n/>`,
                ],
                maxLength
            );
        }
        const variants = [];
        if (inlineChildren != undefined) {
            variants.push(
                inlineAttributesWithSpace != undefined
                    ? `<${name}${inlineAttributesWithSpace}>${inlineChildren}</${name}>`
                    : undefined
            );
        }
        variants.push(
            inlineAttributesWithSpace != undefined
                ? `<${name}${inlineAttributesWithSpace}>\n${this.indentText(regularChildren, 1)}\n</${name}>`
                : undefined,
            `<${name}${indentedRegularAttributes}>\n${this.indentText(regularChildren, 1)}\n</${name}>`
        );
        return this.miniMax(variants, maxLength);
    }

    private isCommentSingleLine(child: SugarComment): boolean {
        return !child.text
            .replace(/^\s+/, "")
            .replace(/\s+$/, "")
            .includes("\n");
    }

    private removeEmptyLines(value: string): string {
        return value
            .split("\n")
            .map(x => (/^\s+$/.test(x) ? "" : x))
            .join("\n");
    }

    private formatCommentMultiline(child: SugarComment, maxLength: number): string {
        if (this.isCommentSingleLine(child)) {
            const trimmedText = child.text.replace(/^\s+/, "").replace(/\s+$/, "");
            const result = `<!-- ${trimmedText} -->`;
            if (result.length <= maxLength) {
                return result;
            }
            return `<!--\n${this.indentText(trimmedText, 1)}\n-->`;
        }
        let lines = child.text
            .replace(/^\s+/, "")
            .replace(/\s+$/, "")
            .split("\n");
        let linesExceptFirst = lines.slice(1);
        const minIndent = linesExceptFirst
            .map(x => this.getLeadingSpacesCount(x))
            .reduce((x, y) => Math.min(x, y), Infinity);
        if (Number.isFinite(minIndent)) {
            linesExceptFirst = linesExceptFirst.map(x => x.substring(minIndent));
        }
        lines = [lines[0], ...linesExceptFirst];
        return `<!--\n${this.indentText(lines.join("\n"), 1)}\n-->`;
    }

    private getLeadingSpacesCount(str: string): number {
        const match = /^[ ]*/.exec(str);
        if (match == undefined) {
            return 0;
        }
        return match[0].length;
    }

    private formatCommentSingleLine(child: SugarComment): string {
        if (!this.isCommentSingleLine(child)) {
            throw new Error("Cannot format multiline comment as single line");
        }
        const trimmedText = child.text.replace(/^\s+/, "").replace(/\s+$/, "");
        return `<!-- ${trimmedText} -->`;
    }

    private formatAttributeList(attributes: SugarAttribute[], maxLength: number): FormattingResult {
        if (attributes.length === 0) {
            return {
                inline: "",
                regular: "",
            };
        }
        const formattedAttributes = attributes.map(x => this.formatAttribute(x, maxLength));
        let inline: string | undefined;
        if (formattedAttributes.map(x => x.inline).every(isNotNullOrUndefined)) {
            inline = formattedAttributes.map(x => x.inline).join(" ");
        }
        if (!formattedAttributes.map(x => x.regular).every(isNotNullOrUndefined)) {
            throw new Error("InvalidProgramState");
        }
        const regular = formattedAttributes.map(x => x.regular).join("\n");
        return {
            inline: inline,
            regular: regular,
        };
    }

    private formatAttribute(attribute: SugarAttribute, maxLength: number): FormattingResult {
        if (attribute.value == undefined) {
            return { inline: `${attribute.name.value}`, regular: `${attribute.name.value}` };
        }
        if (attribute.value.type === "AttributeValue") {
            return {
                inline: `${attribute.name.value}="${attribute.value.value}"`,
                regular: `${attribute.name.value}="${attribute.value.value}"`,
            };
        } else {
            const attributeValuePrefix = `${attribute.name.value}={`;
            const { inline: inlineValue, regular: regularValue } = this.formatAttributeJavaScriptValue(
                attribute.value,
                maxLength - attributeValuePrefix.length
            );
            const inline = `${attribute.name.value}={${inlineValue}}`;
            const variants = [];
            if (inlineValue) {
                variants.push(inline);
            }
            if (regularValue) {
                variants.push(`${attribute.name.value}={${regularValue}}`);
            }
            return {
                inline: inline,
                regular: this.miniMax(variants, maxLength),
            };
        }
    }

    private formatAttributeJavaScriptValue(
        attributeValue: SugarAttributeJSLiteralValue,
        maxLength: number
    ): FormattingResult {
        return this.formatJavaScriptLiteral(attributeValue.value, maxLength);
    }

    private formatJavaScriptLiteral(value: SugarJavaScriptLiteral, maxLength: number): FormattingResult {
        if (value.type === "JavaScriptStringLiteral") {
            return {
                inline: `"${value.value}"`,
                regular: `"${value.value}"`,
            };
        }
        if (value.type === "JavaScriptBooleanLiteral") {
            return {
                inline: `${JSON.stringify(value.value)}`,
                regular: `${JSON.stringify(value.value)}`,
            };
        }
        if (value.type === "JavaScriptNumberLiteral") {
            return {
                inline: `${JSON.stringify(value.value)}`,
                regular: `${JSON.stringify(value.value)}`,
            };
        }

        let inline: string | undefined;
        let regular: string | undefined;
        if (value.type === "JavaScriptArrayLiteral") {
            if (value.values.length === 0) {
                return { inline: "[]", regular: "[]" };
            }
            const inlineValues = value.values
                .map(x => this.formatJavaScriptLiteral(x, maxLength - this.options.tabs))
                .map(x => x.inline);
            if (inlineValues.every(x => x != undefined)) {
                inline = `[${inlineValues.join(", ")}]`;
            }
            const regularValues = value.values
                .map(x => this.formatJavaScriptLiteral(x, maxLength - this.options.tabs))
                .map(x => x.regular);
            regular = `[\n${this.indentText(regularValues.join(",\n"), 1)}\n]`;
            return {
                inline: inline,
                regular: this.miniMax([inline, regular].filter(isNotNullOrUndefined), maxLength),
            };
        }
        if (value.type === "JavaScriptObjectLiteral") {
            if (value.properties.length === 0) {
                return { inline: "{}", regular: "{}" };
            }
            const formattedAttributes = value.properties.map(x => this.formatProperty(x, maxLength));
            let inline: string | undefined;
            if (formattedAttributes.map(x => x.inline).every(isNotNullOrUndefined)) {
                inline = `{ ${formattedAttributes.map(x => x.inline).join(", ")} }`;
            }
            if (!formattedAttributes.map(x => x.regular).every(isNotNullOrUndefined)) {
                throw new Error("InvalidProgramState");
            }
            const regular = `{\n${this.indentText(formattedAttributes.map(x => x.regular).join(",\n"), 1)},\n}`;
            return {
                inline: inline,
                regular: regular,
            };
        }
        throw new Error(`Unknown object type`);
    }

    private formatProperty(attribute: SugarJavaScriptObjectLiteralProperty, maxLength: number): FormattingResult {
        const { inline: inlineValue, regular: regularValue } = this.formatJavaScriptLiteral(
            attribute.value,
            maxLength - this.options.tabs
        );
        const nameValue = attribute.name.value;
        const formattedName =
            typeof nameValue === "string" ? nameValue : this.formatJavaScriptLiteral(nameValue, maxLength).inline;
        const inline = `${formattedName}: ${inlineValue}`;
        const variants = [];
        if (inlineValue) {
            variants.push(inline);
        }
        if (regularValue) {
            variants.push(`${formattedName}: ${regularValue}`);
            variants.push(`${formattedName}:\n${this.indentText(regularValue, 1)}`);
        }
        return {
            inline: inline,
            regular: this.miniMax(variants, maxLength),
        };
    }

    private formatChild(element: SugarText | SugarElement | SugarComment, maxLength: number): string {
        if (element.type === "Text") {
            return this.formatText(element, maxLength);
        } else if (element.type === "Element") {
            return this.formatElement(element, maxLength);
        } else if (element.type === "Comment") {
            return this.formatCommentMultiline(element, maxLength);
        }
        throw new Error(`Invalid child type`);
    }

    private formatTextSingleLine(text: SugarText): string {
        const words = text.value
            .split(/[\s\n]+/)
            .filter(x => x !== "")
            .filter(x => !/$\s+^/.test(x));
        return words.join(" ");
    }

    private formatText(text: SugarText, maxLength: number): string {
        const words = text.value
            .split(/[\s\n]+/)
            .filter(x => x !== "")
            .filter(x => !/$\s+^/.test(x));
        const lines = [];
        let currentLine = "";
        for (const word of words) {
            if (currentLine === "") {
                currentLine = word;
                continue;
            }
            if (currentLine.length + word.length + 1 > maxLength) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine += " " + word;
            }
        }
        if (currentLine !== "") {
            lines.push(currentLine);
        }
        return lines.join("\n");
    }

    private miniMax(variants: Array<undefined | string>, maxWidth: number): string {
        const filteredVariants = variants.filter(isNotNullOrUndefined);
        if (filteredVariants.length === 0) {
            throw new Error("variant must be a non empty array");
        }
        let minOverLengthIndex = 0;
        let minOverLength = this.getSumOfOverLength(filteredVariants[0], maxWidth);
        for (let i = 1; i < filteredVariants.length; i++) {
            const overLength = this.getSumOfOverLength(filteredVariants[i], maxWidth);
            if (overLength < minOverLength) {
                minOverLength = overLength;
                minOverLengthIndex = i;
            }
        }
        return filteredVariants[minOverLengthIndex];
    }

    private getSumOfOverLength(value: string, maxWidth: number): number {
        return value
            .split("\n")
            .map(x => x.length - maxWidth)
            .filter(x => x > 0)
            .reduce((x, y) => x + y, 0);
    }

    private formatChildren(
        elements: Array<SugarText | SugarElement | SugarComment>,
        maxLength: number
    ): FormattingResult {
        if (elements.length === 0) {
            return { inline: "", regular: "" };
        }
        let inline: string | undefined;
        if (elements.length === 1) {
            const singleElement = elements[0];
            if (singleElement.type === "Text") {
                inline = this.formatTextSingleLine(singleElement);
            }
            if (singleElement.type === "Comment" && this.isCommentSingleLine(singleElement)) {
                inline = this.formatCommentSingleLine(singleElement);
            }
        }
        const regular = elements.map(x => this.formatChild(x, maxLength)).join("\n");
        return {
            inline: inline,
            regular: regular,
        };
    }

    private indentText(text: string, level: number, options: { skipFirst: boolean } = { skipFirst: false }): string {
        return text
            .split("\n")
            .map((x, index) => {
                if (options.skipFirst && index === 0) {
                    return x;
                }
                return this.getIndent(level) + x;
            })
            .join("\n");
    }

    private getIndent(level: number): string {
        let result = "";
        for (let i = 0; i < level * this.options.tabs; i++) {
            result += " ";
        }
        return result;
    }
}
