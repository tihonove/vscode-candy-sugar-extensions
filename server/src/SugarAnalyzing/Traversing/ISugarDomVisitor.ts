import {
    SugarAttribute,
    SugarAttributeName,
    SugarElement,
    SugarElementName,
} from "../../SugarParsing/SugarGrammar/SugarParser";

export interface ISugarDomVisitor {
    enterElement(element: SugarElement): void;
    visitElement(element: SugarElement): void;
    exitElement(element: SugarElement): void;

    visitElementName(elementName: SugarElementName): void;
    visitAttribute(attribute: SugarAttribute): void;
    visitAttributeName(attributeName: SugarAttributeName): void;
}
