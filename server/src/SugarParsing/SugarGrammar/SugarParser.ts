import { CodePosition, IPegJSTracer } from "../../Utils/PegJSUtils/Types";

// @ts-ignore
import source from "./SugarParserSource";

// tslint:disable-next-line no-eval no-unsafe-any
const evalParse: (input: string, options: { tracer?: IPegJSTracer }) => SugarElement = eval(source).parse;

export function parseSugar(input: string, options: { tracer?: IPegJSTracer }): SugarElement {
    // TODO придумать вальный способ убрать bom
    const inputWithoutBom = input.replace(/^\uFEFF/, "");
    return evalParse(inputWithoutBom, options);
}

export type SugarSyntaxNode =
    | SugarElement
    | SugarText
    | SugarElementName
    | SugarAttributeName
    | SugarAttributeValue
    | SugarAttribute;

export interface SugarElement {
    type: "Element";
    name: SugarElementName;
    attributes?: SugarAttribute[];
    children: Array<SugarElement | SugarText>;
    position: CodePosition;
    parent?: SugarElement;
}

export interface SugarText {
    type: "Text";
    parent?: SugarElement;
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

export interface SugarAttribute {
    type: "Attribute";
    name: SugarAttributeName;
    value?: SugarAttributeValue;
    position: CodePosition;
    parent: SugarElement;
}
