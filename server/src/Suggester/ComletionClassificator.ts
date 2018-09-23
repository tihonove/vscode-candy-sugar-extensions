import { parse } from "./SugarGrammar/SugarParser";

export enum ExpectedToken {
    ElementName = "ElementName",
    AttributeName = "AttributeName",
    AttributeValue = "AttributeValue",
    AttributeValueContent = "AttributeValueContent",
}

export interface ElementContext {
    elementName?: string;
    attributes?: AttributeContext[];
}

export interface AttributeContext {
    attributeName?: string;
    attributeValue?: string;
}

export interface CompletionContext {
    expectedToken: ExpectedToken;
    elementContext?: ElementContext;
    attributeContext?: AttributeContext;
}

interface CodeLocation {
    offset: number;
    line: number;
    column: number;
}

interface TraceContext {
    type: "rule.match" | "rule.fail" | "rule.enter";
    rule: string;
    location: { start: CodeLocation; end: CodeLocation };
    result: any;
}

class ElementContextTracer {
    private readonly elementStack: ElementContext[] = [];
    private readonly expectedRulesToFail: string[];
    private readonly caretOffset: number;
    public failedRule?: string;

    public constructor(expectedRulesToFail: string[], caretOffset: number) {
        this.expectedRulesToFail = expectedRulesToFail;
        this.caretOffset = caretOffset;
    }

    public peekElement(): undefined | ElementContext {
        return this.elementStack[this.elementStack.length - 1];
    }

    public peekAttribute(): undefined | AttributeContext {
        const topElement = this.peekElement();
        if (topElement == undefined || topElement.attributes == undefined) {
            return undefined;
        }
        return topElement.attributes[topElement.attributes.length - 1];
    }

    public trace(context: TraceContext) {
        if (context.type === "rule.enter" && context.rule === "Element") {
            this.elementStack.push({});
        }
        if (context.type === "rule.match" && context.rule === "ElementName") {
            this.elementStack[this.elementStack.length - 1].elementName = context.result;
        }
        if (context.type === "rule.fail") {
            if (this.failedRule == undefined && this.expectedRulesToFail.includes(context.rule)) {
                if (context.location.end.offset === this.caretOffset) {
                    this.failedRule = context.rule;
                }
            }
        }
        if (context.type === "rule.enter" && context.rule === "AttributeList") {
            const topElement = this.peekElement();
            if (topElement != undefined) {
                topElement.attributes = topElement.attributes || [];
            }
        }
        if (context.type === "rule.match" && context.rule === "AttributeName") {
            const topElement = this.peekElement();
            if (topElement != undefined) {
                topElement.attributes = topElement.attributes || [];
                topElement.attributes.push({});
                topElement.attributes[topElement.attributes.length - 1].attributeName = context.result;
            }
        }
        if (context.type === "rule.match" && context.rule === "AttributeValueContent") {
            const topElement = this.peekElement();
            if (topElement != undefined && topElement.attributes != undefined && topElement.attributes.length > 0) {
                topElement.attributes[topElement.attributes.length - 1].attributeValue = context.result;
            }
        }
    }
}

export function getCompletionContext(input: string): undefined | CompletionContext {
    const tracer = new ElementContextTracer(
        [
            "SpaceAfterElement",
            "ElementName",
            "AttributeName",
            "EqualsAfterAttributeName",
            "AttributeValue",
            "AttributeValueClosingQuote",
        ],
        input.length
    );
    try {
        parse(input, {
            tracer: tracer,
        });
        return undefined;
    } catch (e) {
        if (tracer.failedRule === "SpaceAfterElement") {
            return {
                elementContext: tracer.peekElement(),
                expectedToken: ExpectedToken.ElementName,
            };
        }
        if (tracer.failedRule === "ElementName") {
            return {
                elementContext: tracer.peekElement(),
                expectedToken: ExpectedToken.ElementName,
            };
        }
        if (tracer.failedRule === "EqualsAfterAttributeName") {
            return {
                elementContext: tracer.peekElement(),
                attributeContext: tracer.peekAttribute(),
                expectedToken: ExpectedToken.AttributeName,
            };
        }
        if (tracer.failedRule === "AttributeName") {
            return {
                elementContext: tracer.peekElement(),
                expectedToken: ExpectedToken.AttributeName,
            };
        }
        if (tracer.failedRule === "AttributeValue") {
            return {
                elementContext: tracer.peekElement(),
                attributeContext: tracer.peekAttribute(),
                expectedToken: ExpectedToken.AttributeValue,
            };
        }
        if (tracer.failedRule === "AttributeValueClosingQuote") {
            const attribute = tracer.peekAttribute();
            if (attribute != undefined && attribute.attributeValue != undefined) {
                return {
                    elementContext: tracer.peekElement(),
                    attributeContext: tracer.peekAttribute(),
                    expectedToken: ExpectedToken.AttributeValueContent,
                };
            }
        }
        return undefined;
    }
}
