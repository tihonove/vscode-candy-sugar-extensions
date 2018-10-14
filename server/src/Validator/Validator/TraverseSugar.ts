import {
    SugarAttribute,
    SugarAttributeName,
    SugarElement,
    SugarElementName,
    SugarSyntaxNode,
} from "../../SugarParsing/SugarGrammar/SugarParser";

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

export interface ISugarDomVisitor {
    enterElement(element: SugarElement): void;
    exitElement(element: SugarElement): void;
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

    public enterElement(_element: SugarElement): void {
        // empty implementation
    }

    public exitElement(_element: SugarElement): void {
        // empty implementation
    }
}
