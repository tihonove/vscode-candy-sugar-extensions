import {
    SugarAttribute,
    SugarAttributeName,
    SugarElement,
    SugarElementName,
    SugarSyntaxNode,
} from "../../SugarCodeDomBuilder/SugarGrammar/SugarParser";

export function traverseSugar(node: SugarSyntaxNode, visitor: ISugarDomVisitor): void {
    if (node.type === "Element") {
        visitor.visitElement(node);
        traverseSugar(node.name, visitor);
        for (const attribute of node.attributes || []) {
            traverseSugar(attribute, visitor);
        }
        for (const child of node.children) {
            traverseSugar(child, visitor);
        }
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

export interface ISugarDomVisitor {
    visitElementName(elementName: SugarElementName): void;
    visitAttribute(attribute: SugarAttribute): void;
    visitAttributeName(attributeName: SugarAttributeName): void;
    visitElement(element: SugarElement): void;
}

export class EmptySugarDomVisitor implements ISugarDomVisitor {
    public visitAttribute(_attribute: SugarAttribute): void {
        // empty implementation
    }

    public visitAttributeName(_attributeName: SugarAttributeName): void {
        // empty implementation
    }

    public visitElement(_element: SugarElement): void {
        // empty implementation
    }

    public visitElementName(_elementName: SugarElementName): void {
        // empty implementation
    }
}
