import { IPegJSTracer, TraceContext } from "../PegJSTypes/PegJSTypes";
import { valueOrDefault } from "../Utils/TypingUtils";

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
    elementContextStack: ElementContext[];
    elementContext?: ElementContext;
    attributeContext?: AttributeContext;
}

class ElementContextTracer implements IPegJSTracer {
    private readonly elementStack: ElementContext[] = [];
    private readonly expectedRulesToFail: string[];
    private readonly caretOffset: number;
    public failedRule?: string;
    public failedRuleStackSnapshot?: ElementContext[];

    public constructor(expectedRulesToFail: string[], caretOffset: number) {
        this.expectedRulesToFail = expectedRulesToFail;
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
                elementContext: tracer.peekElementFromFailedSnapshot(),
                expectedToken: ExpectedToken.ElementName,
                elementContextStack: tracer.getElementStackSnapshot(),
            };
        }
        if (tracer.failedRule === "ElementName") {
            return {
                elementContext: tracer.peekElementFromFailedSnapshot(),
                expectedToken: ExpectedToken.ElementName,
                elementContextStack: tracer.getElementStackSnapshot(),
            };
        }
        if (tracer.failedRule === "EqualsAfterAttributeName") {
            return {
                elementContext: tracer.peekElementFromFailedSnapshot(),
                attributeContext: tracer.peekAttribute(),
                expectedToken: ExpectedToken.AttributeName,
                elementContextStack: tracer.getElementStackSnapshot(),
            };
        }
        if (tracer.failedRule === "AttributeName") {
            return {
                elementContext: tracer.peekElementFromFailedSnapshot(),
                expectedToken: ExpectedToken.AttributeName,
                elementContextStack: tracer.getElementStackSnapshot(),
            };
        }
        if (tracer.failedRule === "AttributeValue") {
            return {
                elementContext: tracer.peekElementFromFailedSnapshot(),
                attributeContext: tracer.peekAttribute(),
                expectedToken: ExpectedToken.AttributeValue,
                elementContextStack: tracer.getElementStackSnapshot(),
            };
        }
        if (tracer.failedRule === "AttributeValueClosingQuote") {
            const attribute = tracer.peekAttribute();
            if (attribute != undefined && attribute.attributeValue != undefined) {
                return {
                    elementContext: tracer.peekElementFromFailedSnapshot(),
                    attributeContext: tracer.peekAttribute(),
                    expectedToken: ExpectedToken.AttributeValueContent,
                    elementContextStack: tracer.getElementStackSnapshot(),
                };
            }
        }
        return undefined;
    }
}
