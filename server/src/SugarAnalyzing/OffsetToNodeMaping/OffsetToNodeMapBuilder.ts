import {
    parseSugar,
    SugarAttributeName,
    SugarAttributeValue,
    SugarElement,
    SugarElementName,
    SugarSyntaxNode,
} from "../../SugarParsing/SugarGrammar/SugarParser";
import { NullTracer } from "../../Utils/PegJSUtils/NullTracer";

import { OffsetToNodeMap } from "./OffsetToNodeMap";

export type NodeWithDefinition = SugarElementName | SugarAttributeName | SugarAttributeValue;

export class OffsetToNodeMapBuilder {
    public buildOffsetToNodeMap(input: string): OffsetToNodeMap {
        return this.buildOffsetToNodeMapFromDom(this.buildCodeDom(input));
    }

    public buildCodeDom(input: string): SugarElement {
        return parseSugar(input, {
            tracer: new NullTracer(),
        });
    }

    public buildOffsetToNodeMapFromDom(sugarDocument: SugarElement): OffsetToNodeMap {
        const foundElements: NodeWithDefinition[] = [];
        this.traverseSugarAstAndGetNodes(sugarDocument, foundElements);
        return new OffsetToNodeMap(foundElements);
    }

    private traverseSugarAstAndGetNodes(root: SugarSyntaxNode, foundNodes: NodeWithDefinition[]): void {
        if (root.type === "Element") {
            this.traverseSugarAstAndGetNodes(root.name, foundNodes);
            for (const attribute of root.attributes || []) {
                this.traverseSugarAstAndGetNodes(attribute, foundNodes);
            }
            for (const child of root.children || []) {
                this.traverseSugarAstAndGetNodes(child, foundNodes);
            }
        }
        if (root.type === "ElementName") {
            foundNodes.push(root);
        }
        if (root.type === "Attribute") {
            this.traverseSugarAstAndGetNodes(root.name, foundNodes);
            if (root.value != undefined && root.value.type === "AttributeValue") {
                this.traverseSugarAstAndGetNodes(root.value, foundNodes);
            }
        }
        if (root.type === "AttributeName") {
            foundNodes.push(root);
        }
        if (root.type === "AttributeValue") {
            foundNodes.push(root);
        }
    }
}
