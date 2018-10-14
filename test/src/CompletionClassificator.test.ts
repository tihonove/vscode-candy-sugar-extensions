import { suite, test } from "mocha-typescript";

import {
    AttributeContext,
    CompletionContext,
    ElementContext,
    getCompletionContext,
} from "../../server/src/Suggester/CompletionClassificator/CompletionClassificator";
import { ExpectedTokenType } from "../../server/src/Suggester/CompletionClassificator/ExpectedTokenType";

import { expect } from "./Utils/Expect";

@suite
export class CompletionClassificatorTest {
    @test
    public testCompleteElement(): void {
        const completionContext = getCompletionContext("<a");
        this.assertCompletionContext(completionContext, ExpectedTokenType.ElementName, {
            elementName: "a",
            attributes: [],
        });
    }

    @test
    public testCompleteSecondElement(): void {
        const completionContext = getCompletionContext("<aa><bb");
        this.assertCompletionContext(completionContext, ExpectedTokenType.ElementName, {
            elementName: "bb",
            attributes: [],
        });
    }

    @test
    public testCompleteAfterSelfClosingElement(): void {
        const completionContext = getCompletionContext("<aa><bb /><cc");
        this.assertCompletionContext(completionContext, ExpectedTokenType.ElementName, {
            elementName: "cc",
            attributes: [],
        });
    }

    @test
    public testCompleteAfterSelfClosingElementWithAttribute(): void {
        const completionContext = getCompletionContext('<aa><bb value="1" /><cc');
        this.assertCompletionContext(completionContext, ExpectedTokenType.ElementName, {
            elementName: "cc",
            attributes: [],
        });
    }

    @test
    public testCompleteElementWithoutName(): void {
        const completionContext = getCompletionContext("<");
        this.assertCompletionContext(completionContext, ExpectedTokenType.ElementName, {});
    }

    @test
    public testCompleteAttributeName(): void {
        const completionContext = getCompletionContext("<aaa at");
        this.assertCompletionContext(
            completionContext,
            ExpectedTokenType.AttributeName,
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
        this.assertCompletionContext(completionContext, ExpectedTokenType.AttributeName, {
            elementName: "aaa",
            attributes: [],
        });
    }

    @test
    public testCompleteElementAfterNewLineAndSpaces(): void {
        const completionContext = getCompletionContext("<aaa>\n    <bb");
        this.assertCompletionContext(completionContext, ExpectedTokenType.ElementName, {
            elementName: "bb",
            attributes: [],
        });
    }

    @test
    public testCompleteAttributeValue(): void {
        const completionContext = getCompletionContext("<aaa attr=");
        this.assertCompletionContext(
            completionContext,
            ExpectedTokenType.AttributeValue,
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
            ExpectedTokenType.AttributeValueContent,
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
    public testCompleteAttributeValueContentInsideSingleQuotedString(): void {
        const completionContext = getCompletionContext('<aaa attr="');
        this.assertCompletionContext(
            completionContext,
            ExpectedTokenType.AttributeValueContent,
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
            ExpectedTokenType.AttributeValueContent,
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
    public testGetElementStack(): void {
        const completionContext = getCompletionContext('<aaa attr="content" attr2');
        expect(completionContext != undefined).to.eql(true);
        if (completionContext != undefined) {
            expect(completionContext.elementContextStack).to.shallowDeepEqual([
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
            ]);
        }
    }

    @test
    public testGetElementStackWithSingleQuotedString(): void {
        const completionContext = getCompletionContext("<aaa attr='content' attr2");
        expect(completionContext != undefined).to.eql(true);
        if (completionContext != undefined) {
            expect(completionContext.elementContextStack).to.shallowDeepEqual([
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
            ]);
        }
    }

    @test
    public testGetElementStackWithTwoItems(): void {
        const completionContext = getCompletionContext('<bbb attr2="zzz"><aaa attr="content" attr2');
        expect(completionContext != undefined).to.eql(true);
        if (completionContext != undefined) {
            expect(completionContext.elementContextStack).to.shallowDeepEqual([
                {
                    elementName: "bbb",
                    attributes: [
                        {
                            attributeName: "attr2",
                            attributeValue: "zzz",
                        },
                    ],
                },
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
            ]);
        }
    }

    @test
    public testGetElementStackWithClosingItem(): void {
        const completionContext = getCompletionContext('<xxx><yyy></yyy><bbb attr2="zzz"><aaa attr="content" attr2');
        expect(completionContext != undefined).to.eql(true);
        if (completionContext != undefined) {
            expect(completionContext.elementContextStack).to.shallowDeepEqual([
                {
                    elementName: "xxx",
                },
                {
                    elementName: "bbb",
                    attributes: [
                        {
                            attributeName: "attr2",
                            attributeValue: "zzz",
                        },
                    ],
                },
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
            ]);
        }
    }

    @test
    public testCompleteSecondAttributeValue(): void {
        const completionContext = getCompletionContext('<aaa attr="content" attr2');
        this.assertCompletionContext(
            completionContext,
            ExpectedTokenType.AttributeName,
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

    @test
    public testNonMeaningfulCases(): void {
        this.checkValidGrammarAtBeginning(` <z><a b="value-b" /> <aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`<z><a b="value-b" />\n<aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`<z><a b="value-b" />\t<aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`\n<z><a b="value-b" /><aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`\r<z><a b="value-b" /><aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(` <z><a b="value-b" /><aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`<z><a><!-- comment --><b /></a><aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`<z><a>aaa<!-- comment -->aaa<b />aaa</a><aaa attr="content" attr2`);
    }

    @test
    public testNamesWithDashes(): void {
        this.checkValidGrammarAtBeginning(`<aa-a a-ttr="content" attr-`);
    }

    @test
    public testJsValues(): void {
        this.checkValidGrammarAtBeginning(`<z><a b={[1, 2]} /><aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`<z><a b={["1", "2"]} /><aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`<z><a b={["1", "\\"2"]} /><aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`<z><a b={["1", "/2"]} /><aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`<z><a b={[ ["1"], [1]]} /><aaa attr="content" attr2`);
        this.checkValidGrammarAtBeginning(`<z><a b={ [ [ "1" ] , [ 1 ] ] } /><aaa attr="content" attr2`);
    }

    private checkValidGrammarAtBeginning(input: string): void {
        const completionContext = getCompletionContext(input);
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeName,
        });
    }

    private assertCompletionContext(
        completionContext: undefined | CompletionContext,
        expectedToken: ExpectedTokenType,
        elementContext: undefined | ElementContext,
        attributeContext?: undefined | AttributeContext
    ): void {
        expect(completionContext != undefined).to.eql(true);
        if (completionContext != undefined) {
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
