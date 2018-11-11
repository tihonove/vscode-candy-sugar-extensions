import { SubscriptionsTracer } from "../../Utils/PegJSUtils/SubscriptionsTracer";
import { CodePosition, RuleAction, TraceContext } from "../../Utils/PegJSUtils/Types";
import {
    parseSugar,
    SugarAttribute,
    SugarAttributeName,
    SugarAttributeValue,
    SugarElement,
    SugarElementName,
} from "../SugarGrammar/SugarParser";

import { ExpectedTokenType } from "./ExpectedTokenType";

export type CompletionContext =
    | {
          expectedToken: ExpectedTokenType.ElementName;
          node: SugarElementName;
      }
    | {
          expectedToken: ExpectedTokenType.AttributeName;
          node: SugarAttributeName;
      }
    | {
          expectedToken: ExpectedTokenType.AttributeValue;
          node: SugarAttributeValue;
      }
    | {
          expectedToken: ExpectedTokenType.AttributeValueContent;
          node: SugarAttributeValue;
      };

class ElementContextTracer extends SubscriptionsTracer {
    private readonly elementStack: SugarElement[] = [];
    private readonly expectedRulesToFail: string[];
    private readonly caretOffset: number;
    public failedRule?: string;
    public failedRuleStackSnapshot?: SugarElement[];

    public constructor(expectedRulesToFail: string[], caretOffset: number) {
        super();
        this.expectedRulesToFail = expectedRulesToFail;
        this.caretOffset = caretOffset;

        this.register<SugarElement>(RuleAction.Enter, "Element", this.enterElement);
        this.register<SugarElementName>(RuleAction.Match, "ElementName", this.matchElementName);
        this.register<SugarElement>(RuleAction.Fail, "Element", this.failElement);
        this.register<SugarAttribute>(RuleAction.Enter, "Attribute", this.enterAttribute);
        this.register<SugarAttributeName>(RuleAction.Match, "AttributeName", this.matchAttributeName);
        this.register<SugarAttributeValue>(RuleAction.Enter, "AttributeValue", this.enterAttributeValue);
        this.register<string>(RuleAction.Match, "AttributeValueContent", this.matchAttributeValueContent);
        this.register<string>(RuleAction.Match, "AttributeSingleQuotedValueContent", this.matchAttributeValueContent);
        this.register<SugarAttributeValue>(RuleAction.Match, "AttributeValue", this.matchAttributeValue);
        this.register<SugarAttribute>(RuleAction.Match, "Attribute", this.matchAttribute);
        this.register<SugarElement>(RuleAction.Match, "Element", this.matchElement);
    }

    public trace(context: TraceContext): void {
        super.trace(context);
        if (context.type === "rule.fail") {
            if (this.failedRule == undefined && this.expectedRulesToFail.includes(context.rule)) {
                if (context.location.end.offset === this.caretOffset) {
                    this.failedRule = context.rule;
                    this.failedRuleStackSnapshot = [...this.elementStack];
                    this.stopProcessing();
                }
            }
        }
    }

    private readonly enterElement = (_result: SugarElement, location: CodePosition): void => {
        const parentElement = lastOrUndefined(this.elementStack);
        const item: SugarElement = this.createProvisionalSugarElement(parentElement, location);
        if (parentElement != undefined) {
            parentElement.children.push(item);
        }
        this.elementStack.push(item);
    };

    private readonly matchElementName = (elementName: SugarElementName) => {
        this.updateLastElement(lastElement => {
            elementName.parent = lastElement;
            lastElement.name = elementName;
            lastElement.position.end = elementName.position.end;
        });
    };

    private readonly enterAttribute = (_result: SugarAttribute, location: CodePosition): void => {
        this.updateLastElement(topElement => {
            const attribute = this.createProvisionalSugarAttribute(topElement, location);
            topElement.attributes = topElement.attributes || [];
            topElement.attributes.push(attribute);
        });
    };

    private readonly matchAttributeName = (result: SugarAttributeName): void => {
        this.updateLastAttribute(lastAttribute => {
            result.parent = lastAttribute;
            lastAttribute.name = result;
            lastAttribute.position.end = result.position.end;
        });
    };

    private readonly enterAttributeValue = (_result: SugarAttributeValue, location: CodePosition): void => {
        this.updateLastAttribute(lastAttribute => {
            const value: SugarAttributeValue = {
                type: "AttributeValue",
                position: location,
                value: "",
                parent: lastAttribute,
            };
            lastAttribute.value = value;
            lastAttribute.position.end = value.position.end;
        });
    };

    private readonly matchAttributeValueContent = (content: string, location: CodePosition): void => {
        this.updateLastAttribute(lastAttribute => {
            if (lastAttribute.value != undefined) {
                lastAttribute.value.value = content;
                lastAttribute.value.position.end = location.end;
            }
            lastAttribute.position.end = location.end;
        });
    };

    private readonly matchAttributeValue = (result: SugarAttributeValue): void => {
        this.updateLastAttribute(lastAttribute => {
            result.parent = lastAttribute;
            lastAttribute.value = result;
            lastAttribute.position.end = result.position.end;
        });
    };

    private readonly matchAttribute = (result: SugarAttribute): void => {
        this.updateLastElement(lastElement => {
            result.parent = lastElement;
            lastElement.attributes = lastElement.attributes || [];
            lastElement.attributes[lastElement.attributes.length - 1] = result;
        });
    };

    private readonly matchElement = (): void => {
        this.elementStack.pop();
    };

    private readonly failElement = (): void => {
        this.elementStack.pop();
    };

    private stopProcessing(): void {
        // TODO Написать заметку почему тут надо именно так
        throw new Error("ErrorToStopPostProcessingOfMatchedRulesInGrammarFailed");
    }

    private updateLastElement(update: (lastElement: SugarElement) => void): void {
        const topElement = lastOrUndefined(this.elementStack);
        if (topElement == undefined) {
            return;
        }
        update(topElement);
    }

    private updateLastAttribute(update: (lastAttribute: SugarAttribute) => void): void {
        const topElement = lastOrUndefined(this.elementStack);
        if (topElement == undefined) {
            return;
        }
        const lastAttribute = lastOrUndefined(topElement.attributes);
        if (lastAttribute == undefined) {
            return;
        }
        update(lastAttribute);
    }

    private createProvisionalSugarAttribute(topElement: SugarElement, location: CodePosition): SugarAttribute {
        const attribute: SugarAttribute = {
            type: "Attribute",
            name: {
                type: "AttributeName",
                position: location,
                value: "",
                // @ts-ignore Фейковая цикличиская ссылка
                parent: undefined,
            },
            value: undefined,
            position: location,
            parent: topElement,
        };
        attribute.name.parent = attribute;
        return attribute;
    }

    private createProvisionalSugarElement(
        parentElement: undefined | SugarElement,
        location: CodePosition
    ): SugarElement {
        const item: SugarElement = {
            type: "Element",
            name: {
                value: "",
                position: location,
                // @ts-ignore Фейковая цикличиская ссылка
                parent: undefined,
                type: "ElementName",
            },
            attributes: [],
            children: [],
            position: location,
            parent: parentElement,
        };
        item.name.parent = item;
        return item;
    }
}

function lastOrUndefined<T>(items: undefined | null | T[]): undefined | T {
    if (items == undefined || items.length === 0) {
        return undefined;
    }
    return items[items.length - 1];
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
    } catch (_ignoredError) {
        if (tracer.failedRule === "SpaceAfterElement") {
            if (tracer.failedRuleStackSnapshot == undefined || tracer.failedRuleStackSnapshot.length === 0) {
                return undefined;
            }
            return {
                expectedToken: ExpectedTokenType.ElementName,
                node: tracer.failedRuleStackSnapshot[tracer.failedRuleStackSnapshot.length - 1].name,
            };
        }
        if (tracer.failedRule === "ElementName") {
            if (tracer.failedRuleStackSnapshot == undefined || tracer.failedRuleStackSnapshot.length === 0) {
                return undefined;
            }
            return {
                expectedToken: ExpectedTokenType.ElementName,
                node: tracer.failedRuleStackSnapshot[tracer.failedRuleStackSnapshot.length - 1].name,
            };
        }
        if (tracer.failedRule === "EqualsAfterAttributeName" || tracer.failedRule === "AttributeName") {
            const topElement = lastOrUndefined(tracer.failedRuleStackSnapshot);
            if (topElement == undefined) {
                return undefined;
            }
            const topAttribute = lastOrUndefined(topElement.attributes);
            if (topAttribute == undefined || topAttribute.name == undefined) {
                return undefined;
            }
            return {
                expectedToken: ExpectedTokenType.AttributeName,
                node: topAttribute.name,
            };
        }
        if (tracer.failedRule === "AttributeValue") {
            const topElement = lastOrUndefined(tracer.failedRuleStackSnapshot);
            if (topElement == undefined) {
                return undefined;
            }
            const topAttribute = lastOrUndefined(topElement.attributes);
            if (
                topAttribute == undefined ||
                topAttribute.name == undefined ||
                topAttribute.value == undefined ||
                typeof topAttribute.value !== "string"
            ) {
                return undefined;
            }
            return {
                expectedToken: ExpectedTokenType.AttributeValue,
                node: topAttribute.value,
            };
        }
        if (
            tracer.failedRule === "AttributeValueClosingQuote" ||
            tracer.failedRule === "AttributeValueSingleClosingQuote"
        ) {
            const topElement = lastOrUndefined(tracer.failedRuleStackSnapshot);
            if (topElement == undefined) {
                return undefined;
            }
            const topAttribute = lastOrUndefined(topElement.attributes);
            if (
                topAttribute == undefined ||
                topAttribute.name == undefined ||
                topAttribute.value == undefined ||
                typeof topAttribute.value !== "string"
            ) {
                return undefined;
            }
            return {
                expectedToken: ExpectedTokenType.AttributeValueContent,
                node: topAttribute.value,
            };
        }
        return undefined;
    }
}
