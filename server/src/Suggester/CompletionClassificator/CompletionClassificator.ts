import { SubscriptionsTracer } from "../../PegJSUtils/SubscriptionsTracer";
import { RuleAction, TraceContext } from "../../PegJSUtils/Types";
import { valueOrDefault } from "../../Utils/TypingUtils";
import { parseSugar } from "../SugarCompletionGrammar/SugarCompletionParser";

import { ExpectedTokenType } from "./ExpectedTokenType";

export interface ElementContext {
    elementName?: string;
    attributes?: AttributeContext[];
}

export interface AttributeContext {
    attributeName?: string;
    attributeValue?: string;
}

export interface CompletionContext {
    expectedToken: ExpectedTokenType;
    elementContextStack: ElementContext[];
    elementContext?: ElementContext;
    attributeContext?: AttributeContext;
}

class ElementContextTracer extends SubscriptionsTracer {
    private readonly elementStack: ElementContext[] = [];
    private readonly expectedRulesToFail: string[];
    private readonly caretOffset: number;
    public failedRule?: string;
    public failedRuleStackSnapshot?: ElementContext[];

    public constructor(expectedRulesToFail: string[], caretOffset: number) {
        super();
        this.expectedRulesToFail = expectedRulesToFail;
        this.caretOffset = caretOffset;
        this.register<void>(RuleAction.Enter, "Element", this.enterElement);
        this.register<string>(RuleAction.Match, "ElementName", this.matchElementName);
    }

    public peekAttribute(): undefined | AttributeContext {
        const topElement = this.peekElementFromFailedSnapshot();
        if (topElement == undefined || topElement.attributes == undefined) {
            return undefined;
        }
        return topElement.attributes[topElement.attributes.length - 1];
    }

    public trace(context: TraceContext): void {
        super.trace(context);
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
        if (
            (context.type === "rule.match" && context.rule === "AttributeValueContent") ||
            context.rule === "AttributeSingleQuotedValueContent"
        ) {
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

    private readonly matchElementName = (elementName: string) => {
        this.elementStack[this.elementStack.length - 1].elementName = elementName;
    };

    private readonly enterElement = () => {
        this.elementStack.push({});
    };
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
            "AttributeValueSingleClosingQuote",
        ],
        input.length
    );
    try {
        parseSugar(input, {
            tracer: tracer,
        });
        return undefined;
    } catch (e) {
        if (tracer.failedRule === "SpaceAfterElement") {
            return {
                elementContext: tracer.peekElementFromFailedSnapshot(),
                expectedToken: ExpectedTokenType.ElementName,
                elementContextStack: tracer.getElementStackSnapshot(),
            };
        }
        if (tracer.failedRule === "ElementName") {
            return {
                elementContext: tracer.peekElementFromFailedSnapshot(),
                expectedToken: ExpectedTokenType.ElementName,
                elementContextStack: tracer.getElementStackSnapshot(),
            };
        }
        if (tracer.failedRule === "EqualsAfterAttributeName") {
            return {
                elementContext: tracer.peekElementFromFailedSnapshot(),
                attributeContext: tracer.peekAttribute(),
                expectedToken: ExpectedTokenType.AttributeName,
                elementContextStack: tracer.getElementStackSnapshot(),
            };
        }
        if (tracer.failedRule === "AttributeName") {
            return {
                elementContext: tracer.peekElementFromFailedSnapshot(),
                expectedToken: ExpectedTokenType.AttributeName,
                elementContextStack: tracer.getElementStackSnapshot(),
            };
        }
        if (tracer.failedRule === "AttributeValue") {
            return {
                elementContext: tracer.peekElementFromFailedSnapshot(),
                attributeContext: tracer.peekAttribute(),
                expectedToken: ExpectedTokenType.AttributeValue,
                elementContextStack: tracer.getElementStackSnapshot(),
            };
        }
        if (
            tracer.failedRule === "AttributeValueClosingQuote" ||
            tracer.failedRule === "AttributeValueSingleClosingQuote"
        ) {
            const attribute = tracer.peekAttribute();
            if (attribute != undefined && attribute.attributeValue != undefined) {
                return {
                    elementContext: tracer.peekElementFromFailedSnapshot(),
                    attributeContext: tracer.peekAttribute(),
                    expectedToken: ExpectedTokenType.AttributeValueContent,
                    elementContextStack: tracer.getElementStackSnapshot(),
                };
            }
        }
        return undefined;
    }
}
