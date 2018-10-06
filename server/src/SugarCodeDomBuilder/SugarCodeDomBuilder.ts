import { CodePosition, IPegJSTracer, TraceContext } from "../PegJSTypes/PegJSTypes";
import { AttributeContext, ElementContext } from "../Suggester/CompletionClassificator";
import { parseSugar } from "../Suggester/SugarGrammar/SugarParser";
import { valueOrDefault } from "../Utils/TypingUtils";

class PositionGettingTracer implements IPegJSTracer {
    private readonly elementStack: ElementContext[] = [];
    public readonly foundElements: SugarCodeDomNode[] = [];

    public constructor() {}

    public trace(context: TraceContext): void {
        if (context.type === "rule.enter" && context.rule === "Element") {
            this.elementStack.push({});
        }
        if (context.type === "rule.match" && context.rule === "ElementName") {
            this.elementStack[this.elementStack.length - 1].elementName = context.result;
            this.foundElements.push(new SugarElementName(context.result, context.location));
        }
        if (context.type === "rule.enter" && context.rule === "AttributeList") {
            const topElement = this.peekElement();
            if (topElement != undefined) {
                topElement.attributes = valueOrDefault<AttributeContext[]>(topElement.attributes, []);
            }
        }
        if (context.type === "rule.match" && context.rule === "AttributeName") {
            const topElement = this.peekElement();
            if (topElement != undefined) {
                topElement.attributes = valueOrDefault<AttributeContext[]>(topElement.attributes, []);
                topElement.attributes.push({});
                // tslint:disable-next-line no-unsafe-any
                topElement.attributes[topElement.attributes.length - 1].attributeName = context.result;
            }
        }
        if (context.type === "rule.match" && context.rule === "AttributeValueContent") {
            const topElement = this.peekElement();
            if (topElement != undefined && topElement.attributes != undefined && topElement.attributes.length > 0) {
                // tslint:disable-next-line no-unsafe-any
                topElement.attributes[topElement.attributes.length - 1].attributeValue = context.result;
            }
        }
        if (context.type === "rule.match" && context.rule === "Element") {
            this.elementStack.pop();
        }
        if (context.type === "rule.fail" && context.rule === "Element") {
            this.elementStack.pop();
        }
    }

    private peekElement(): undefined | ElementContext {
        return this.elementStack[this.elementStack.length - 1];
    }
}

export class SugarCodeDomBuilder {
    public buildPositionToNodeMap(input: string): PositionToNodeMap {
        const positionGettingTracer = new PositionGettingTracer();
        parseSugar(input, {
            tracer: positionGettingTracer,
        });
        return new PositionToNodeMap(positionGettingTracer.foundElements);
    }
}

interface SugarCodeDomNode {
    readonly position: CodePosition;
}

export class SugarElementName implements SugarCodeDomNode {
    public readonly name: string;
    public readonly position: CodePosition;
    public readonly parentNode?: SugarElementName;

    public constructor(name: string, position: CodePosition, parentNode?: SugarElementName) {
        this.name = name;
        this.position = position;
        this.parentNode = parentNode;
    }
}

export class PositionToNodeMap {
    private readonly nodes: SugarCodeDomNode[];

    public constructor(nodes: SugarCodeDomNode[]) {
        this.nodes = nodes;
    }

    public getNodeByOffset(offset: number): undefined | SugarCodeDomNode {
        return this.nodes.find(x => PositionUtils.includes(x.position, offset));
    }
}

class PositionUtils {
    public static includes(position: CodePosition, offset: number): boolean {
        return position.start.offset <= offset && offset <= position.end.offset;
    }
}
