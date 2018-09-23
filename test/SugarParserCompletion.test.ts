import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import {
    AttributeContext,
    CompletionContext,
    ElementContext,
    ExpectedToken,
    getCompletionContext,
} from "../server/src/Suggester/ComletionClassificator";

@suite
export class SugarParserCompletionTest {
    @test
    public testCompleteElement(): void {
        const completionContext = getCompletionContext("<a");
        this.assertCompletionContext(completionContext, ExpectedToken.ElementName, {
            elementName: "a",
            attributes: [],
        });
    }

    @test
    public testCompleteSecondElement(): void {
        const completionContext = getCompletionContext("<aa><bb");
        this.assertCompletionContext(completionContext, ExpectedToken.ElementName, {
            elementName: "bb",
            attributes: [],
        });
    }

    @test
    public testCompleteElementWithoutName(): void {
        const completionContext = getCompletionContext("<");
        this.assertCompletionContext(completionContext, ExpectedToken.ElementName, {});
    }

    @test
    public testCompleteAttributeName(): void {
        const completionContext = getCompletionContext("<aaa at");
        this.assertCompletionContext(
            completionContext,
            ExpectedToken.AttributeName,
            {
                elementName: "aaa",
                attributes: [{ attributeName: "at" }],
            },
            {
                attributeName: "at",
            }
        );
    }

    @test
    public testCompleteAttributeNameWithoutAnyAttr(): void {
        const completionContext = getCompletionContext("<aaa ");
        this.assertCompletionContext(completionContext, ExpectedToken.AttributeName, {
            elementName: "aaa",
            attributes: [],
        });
    }

    @test
    public testCompleteElementAfterNewLineAndSpaces(): void {
        const completionContext = getCompletionContext("<aaa>\n    <bb");
        this.assertCompletionContext(completionContext, ExpectedToken.ElementName, {
            elementName: "bb",
            attributes: [],
        });
    }

    @test
    public testCompleteAttributeValue(): void {
        const completionContext = getCompletionContext("<aaa attr=");
        this.assertCompletionContext(
            completionContext,
            ExpectedToken.AttributeValue,
            {
                elementName: "aaa",
                attributes: [{ attributeName: "attr" }],
            },
            {
                attributeName: "attr",
            }
        );
    }

    @test
    public testCompleteAttributeValueContent(): void {
        const completionContext = getCompletionContext('<aaa attr="');
        this.assertCompletionContext(
            completionContext,
            ExpectedToken.AttributeValueContent,
            {
                elementName: "aaa",
                attributes: [
                    {
                        attributeName: "attr",
                        attributeValue: "",
                    },
                ],
            },
            {
                attributeName: "attr",
                attributeValue: "",
            }
        );
    }

    @test
    public testCompleteAttributeValueContentWithNotEmptyContent(): void {
        const completionContext = getCompletionContext('<aaa attr="cont');
        this.assertCompletionContext(
            completionContext,
            ExpectedToken.AttributeValueContent,
            {
                elementName: "aaa",
                attributes: [
                    {
                        attributeName: "attr",
                        attributeValue: "cont",
                    },
                ],
            },
            {
                attributeName: "attr",
                attributeValue: "cont",
            }
        );
    }

    @test
    public testCompleteSecondAttributeValue(): void {
        const completionContext = getCompletionContext('<aaa attr="content" attr2');
        this.assertCompletionContext(
            completionContext,
            ExpectedToken.AttributeName,
            {
                elementName: "aaa",
                attributes: [
                    {
                        attributeName: "attr",
                        attributeValue: "content",
                    },
                    {
                        attributeName: "attr2",
                    },
                ],
            },
            {
                attributeName: "attr2",
            }
        );
    }

    private assertCompletionContext(
        completionContext: undefined | CompletionContext,
        expectedToken: ExpectedToken,
        elementContext: undefined | ElementContext,
        attributeContext?: undefined | AttributeContext
    ): void {
        expect(completionContext != null).to.eql(true);
        if (completionContext != null) {
            expect(completionContext.expectedToken).to.eql(expectedToken);
            if (elementContext != undefined) {
                expect(completionContext.elementContext).to.eql(elementContext);
            }
            if (attributeContext != undefined) {
                expect(completionContext.attributeContext).to.eql(attributeContext);
            }
        }
    }
}
