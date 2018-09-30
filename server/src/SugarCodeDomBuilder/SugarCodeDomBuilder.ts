import { CodePosition, IPegJSTracer, TraceContext } from "../PegJSTypes/PegJSTypes";
import { AttributeContext, ElementContext } from "../Suggester/CompletionClassificator";
import { parseSugar } from "../Suggester/SugarGrammar/SugarParser";
import { valueOrDefault } from "../Utils/TypingUtils";

class PositionGettingTracer implements IPegJSTracer {
    private readonly elementStack: ElementContext[] = [];
    private readonly expectedRulesToFail: string[];
    private readonly caretOffset: number;
    public failedRule?: string;
    public failedRuleStackSnapshot?: ElementContext[];

    public constructor(expectedRulesToFail: string[], caretOffset: number) {
        this.expectedRulesToFail = [];
        this.caretOffset = caretOffset;
    }

    public peekAttribute(): undefined | AttributeContext {
        const topElement = this.peekElementFromFailedSnapshot();
        if (topElement == undefined || topElement.attributes == undefined) {
            return undefined;
        }
        return topElement.attributes[topElement.attributes.length - 1];
    }

    public trace(context: TraceContext): void {
        if (context.type === "rule.enter" && context.rule === "Element") {
            this.elementStack.push({});
        }
        if (context.type === "rule.match" && context.rule === "ElementName") {
            // tslint:disable-next-line no-unsafe-any
            this.elementStack[this.elementStack.length - 1].elementName = context.result;
        }
        if (context.type === "rule.fail") {
            if (this.failedRule == undefined && this.expectedRulesToFail.includes(context.rule)) {
                if (context.location.end.offset === this.caretOffset) {
                    this.failedRule = context.rule;
                    this.failedRuleStackSnapshot = [...this.elementStack];
                }
            }
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

    public peekElementFromFailedSnapshot(): undefined | ElementContext {
        if (this.failedRuleStackSnapshot == undefined) {
            return undefined;
        }
        return this.failedRuleStackSnapshot[this.failedRuleStackSnapshot.length - 1];
    }

    public getElementStackSnapshot(): ElementContext[] {
        return valueOrDefault<ElementContext[]>(this.failedRuleStackSnapshot, []);
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
        return new PositionToNodeMap();
    }
}

interface SugarCodeDomNode {}

class SugarElementName implements SugarCodeDomNode {
    public readonly name: string;
    public readonly position: CodePosition;
    public readonly parentNode?: SugarElementName;

    public constructor(name: string, position: CodePosition, parentNode?: SugarElementName) {
        this.name = name;
        this.position = position;
        this.parentNode = parentNode;
    }
}

class PositionToNodeMap {
    public getNodeByOffset(offset: number): undefined | SugarCodeDomNode {
        return undefined;
    }
}
