import { CodePosition, IPegJSTracer } from "../../Utils/PegJSUtils/Types";

// @ts-ignore
import source from "./SugarParserSource";

// tslint:disable-next-line no-eval no-unsafe-any
const evalParse: (input: string, options: { tracer?: IPegJSTracer }) => SugarElement = eval(source).parse;

export function parseSugar(input: string, options: { tracer?: IPegJSTracer }): SugarElement {
    // TODO придумать валидный способ убрать bom
    const inputWithoutBom = input.replace(/^\uFEFF/, "");
    return evalParse(inputWithoutBom, options);
}

export type SugarSyntaxNode =
    | SugarElement
    | SugarText
    | SugarElementName
    | SugarAttributeName
    | SugarAttributeValue
    | SugarAttribute
    | SugarComment;

export interface SugarElement {
    type: "Element";
    name: SugarElementName;
    attributes?: SugarAttribute[];
    children: Array<SugarElement | SugarText | SugarComment>;
    position: CodePosition;
    parent?: SugarElement;
}

export interface SugarComment {
    type: "Comment";
    parent?: SugarElement;
    text: string;
}

export interface SugarText {
    type: "Text";
    parent?: SugarElement;
    value: string;
}

export interface SugarElementName {
    type: "ElementName";
    position: CodePosition;
    value: string;
    parent: SugarElement;
}
export interface SugarAttributeName {
    type: "AttributeName";
    position: CodePosition;
    value: string;
    parent: SugarAttribute;
}

export interface SugarAttributeValue {
    type: "AttributeValue";
    position: CodePosition;
    value: string;
    parent: SugarAttribute;
}

export interface SugarAttributeJSLiteralValue {
    type: "AttributeJavaScriptValue";
    position: CodePosition;
    value: SugarJavaScriptLiteral;
    parent: SugarAttribute;
}

export type SugarJavaScriptLiteral =
    | SugarJavaScriptStringLiteral
    | SugarJavaScriptBooleanLiteral
    | SugarJavaScriptNumberLiteral
    | SugarJavaScriptObjectLiteral
    | SugarJavaScriptArrayLiteral;

interface SugarJavaScriptStringLiteral {
    type: "JavaScriptStringLiteral";
    value: string;
}

interface SugarJavaScriptArrayLiteral {
    type: "JavaScriptArrayLiteral";
    values: SugarJavaScriptLiteral[];
}

interface SugarJavaScriptBooleanLiteral {
    type: "JavaScriptBooleanLiteral";
    value: boolean;
}

interface SugarJavaScriptNumberLiteral {
    type: "JavaScriptNumberLiteral";
    value: number;
}

interface SugarJavaScriptObjectLiteral {
    type: "JavaScriptObjectLiteral";
    properties: SugarJavaScriptObjectLiteralProperty[];
}

export interface SugarJavaScriptObjectLiteralProperty {
    type: "JavaScriptObjectLiteralProperty";
    name: SugarJavaScriptObjectLiteralPropertyName;
    value: SugarJavaScriptLiteral;
}

interface SugarJavaScriptObjectLiteralPropertyName {
    type: "JavaScriptObjectLiteralPropertyName";
    value: string | SugarJavaScriptStringLiteral;
}

export interface SugarAttribute {
    type: "Attribute";
    name: SugarAttributeName;
    value?: SugarAttributeValue | SugarAttributeJSLiteralValue;
    position: CodePosition;
    parent: SugarElement;
}
