import { NullTracer } from "../PegJSUtils/NullTracer";
import { CodePosition } from "../PegJSUtils/Types";

import {
    parseSugar,
    SugarAttributeName,
    SugarAttributeValue,
    SugarElementName,
    SugarSyntaxNode,
} from "./SugarGrammar/SugarParser";

type NodeWithDefinition = SugarElementName | SugarAttributeName | SugarAttributeValue;

export class SugarCodeDomBuilder {
    public buildPositionToNodeMap(input: string): PositionToNodeMap {
        const parseResult = parseSugar(input, {
            tracer: new NullTracer(),
        });
        const foundElements: NodeWithDefinition[] = [];
        this.traverseSugarAstAndGetNodes(parseResult, foundElements);
        return new PositionToNodeMap(foundElements);
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
            if (root.value != undefined) {
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

export class PositionToNodeMap {
    private readonly nodes: NodeWithDefinition[];

    public constructor(nodes: NodeWithDefinition[]) {
        this.nodes = nodes;
    }

    public getNodeByOffset(offset: number): undefined | NodeWithDefinition {
        return this.nodes.find(x => PositionUtils.includes(x.position, offset));
    }
}

class PositionUtils {
    public static includes(position: CodePosition, offset: number): boolean {
        return position.start.offset <= offset && offset <= position.end.offset;
    }
}
