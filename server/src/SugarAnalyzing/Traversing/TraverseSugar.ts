import { SugarSyntaxNode } from "../../SugarParsing/SugarGrammar/SugarParser";

import { ISugarDomVisitor } from "./ISugarDomVisitor";

export function traverseSugar(node: SugarSyntaxNode, visitor: ISugarDomVisitor): void {
    if (node.type === "Element") {
        visitor.enterElement(node);
        visitor.visitElement(node);
        traverseSugar(node.name, visitor);
        for (const attribute of node.attributes || []) {
            traverseSugar(attribute, visitor);
        }
        for (const child of node.children) {
            traverseSugar(child, visitor);
        }
        visitor.exitElement(node);
    } else if (node.type === "ElementName") {
        visitor.visitElementName(node);
    } else if (node.type === "Attribute") {
        visitor.visitAttribute(node);
        if (node.name != undefined) {
            traverseSugar(node.name, visitor);
        }
    } else if (node.type === "AttributeName") {
        visitor.visitAttributeName(node);
    }
}
