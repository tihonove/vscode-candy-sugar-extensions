import { SugarElementName, SugarSyntaxNode } from "../../SugarCodeDomBuilder/SugarGrammar/SugarParser";

export function traverseSugar(node: SugarSyntaxNode, visitor: ISugarDomVisitor): void {
    if (node.type === "Element") {
        traverseSugar(node.name, visitor);
        for (const child of node.children) {
            traverseSugar(child, visitor);
        }
    } else if (node.type === "ElementName") {
        visitor.visitElementName(node);
    }
}

export interface ISugarDomVisitor {
    visitElementName(elementName: SugarElementName): void;
}
