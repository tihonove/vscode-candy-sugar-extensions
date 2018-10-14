import { suite, test } from "mocha-typescript";

import { getCompletionContext } from "../../server/src/Suggester/CompletionClassificator/CompletionClassificator";
import { ExpectedTokenType } from "../../server/src/Suggester/CompletionClassificator/ExpectedTokenType";

import { expect } from "./Utils/Expect";

@suite
export class CompletionClassificatorTest {
    @test
    public testCompleteElement(): void {
        const completionContext = getCompletionContext("<a");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.ElementName,
            node: {
                type: "ElementName",
                value: "a",
                parent: {
                    type: "Element",
                    name: {
                        type: "ElementName",
                        value: "a",
                    },
                },
            },
        });
    }

    @test
    public testCompleteSecondElement(): void {
        const completionContext = getCompletionContext("<aa><bb");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.ElementName,
            node: {
                type: "ElementName",
                value: "bb",
                parent: {
                    type: "Element",
                    parent: {
                        type: "Element",
                        name: { value: "aa" },
                    },
                },
            },
        });
    }

    @test
    public testChildrenAreFilled(): void {
        const completionContext = getCompletionContext("<aa><bb");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.ElementName,
            node: {
                parent: {
                    parent: {
                        name: { value: "aa" },
                        children: [
                            {
                                type: "Element",
                                name: { value: "bb" },
                            },
                        ],
                    },
                },
            },
        });
    }

    @test
    public testCompleteAfterSelfClosingElement(): void {
        const completionContext = getCompletionContext("<aa><bb /><cc");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.ElementName,
            node: {
                type: "ElementName",
                value: "cc",
                parent: {
                    type: "Element",
                    parent: {
                        type: "Element",
                        name: { value: "aa" },
                    },
                },
            },
        });
    }

    @test
    public testCompleteAfterSelfClosingElementChildrenAreFilled(): void {
        const completionContext = getCompletionContext("<aa><bb /><cc");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.ElementName,
            node: {
                parent: {
                    parent: {
                        name: { value: "aa" },
                        children: [{ name: { value: "bb" } }, { name: { value: "cc" } }],
                    },
                },
            },
        });
    }

    @test
    public testCompleteAfterSelfClosingElementWithAttribute(): void {
        const completionContext = getCompletionContext('<aa><bb value="1" /><cc');
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.ElementName,
            node: {
                type: "ElementName",
                value: "cc",
            },
        });
    }

    @test
    public testCompleteElementWithoutName(): void {
        const completionContext = getCompletionContext("<");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.ElementName,
            node: {
                type: "ElementName",
                value: "",
                parent: {
                    type: "Element",
                },
            },
        });
    }

    @test
    public testCompleteAttributeName(): void {
        const completionContext = getCompletionContext("<aaa at");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeName,
            node: {
                type: "AttributeName",
                value: "at",
                parent: {
                    type: "Attribute",
                    parent: {
                        type: "Element",
                        name: { value: "aaa" },
                        attributes: { length: 1 },
                    },
                },
            },
        });
    }

    @test
    public testCompleteAttributeNameWithoutAnyAttr(): void {
        const completionContext = getCompletionContext("<aaa ");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeName,
            node: {
                type: "AttributeName",
                value: "",
                parent: {
                    type: "Attribute",
                    parent: {
                        type: "Element",
                        name: { value: "aaa" },
                        attributes: { length: 1 },
                    },
                },
            },
        });
    }

    @test
    public testCompleteAttributeNameWithoutAnyAttr_CheckPosition(): void {
        const completionContext = getCompletionContext("<aaa ");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeName,
            node: {
                type: "AttributeName",
                value: "",
                position: {
                    start: { offset: 5 },
                    end: { offset: 5 },
                },
                parent: {
                    type: "Attribute",
                    position: {
                        start: { offset: 5 },
                        end: { offset: 5 },
                    },
                    parent: {
                        type: "Element",
                        name: { value: "aaa" },
                        attributes: { length: 1 },
                    },
                },
            },
        });
    }

    @test
    public testCompleteElementAfterNewLineAndSpaces(): void {
        const completionContext = getCompletionContext("<aaa>\n    <bb");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.ElementName,
            node: {
                value: "bb",
                parent: {
                    parent: {
                        name: { value: "aaa" },
                    },
                },
            },
        });
    }

    @test
    public testCompleteAttributeValue(): void {
        const completionContext = getCompletionContext("<aaa attr=");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeValue,
            node: {
                type: "AttributeValue",
                value: "",
                parent: {
                    type: "Attribute",
                    name: { value: "attr" },
                    parent: {
                        type: "Element",
                        name: { value: "aaa" },
                    },
                },
            },
        });
    }

    @test
    public testCompleteAttributeValueContent(): void {
        const completionContext = getCompletionContext('<aaa attr="');
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeValueContent,
            node: {
                type: "AttributeValue",
                value: "",
                parent: {
                    type: "Attribute",
                    name: { value: "attr" },
                    parent: {
                        type: "Element",
                        name: { value: "aaa" },
                    },
                },
            },
        });
    }

    @test
    public testCompleteAttributeValueContentInsideSingleQuotedString(): void {
        const completionContext = getCompletionContext("<aaa attr='");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeValueContent,
            node: {
                type: "AttributeValue",
                value: "",
                parent: {
                    type: "Attribute",
                    name: { value: "attr" },
                    parent: {
                        type: "Element",
                        name: { value: "aaa" },
                    },
                },
            },
        });
    }

    @test
    public testCompleteAttributeValueContentWithNotEmptyContent(): void {
        const completionContext = getCompletionContext('<aaa attr="cont');
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeValueContent,
            node: {
                type: "AttributeValue",
                value: "cont",
                parent: {
                    type: "Attribute",
                    name: { value: "attr" },
                    value: {
                        value: "cont",
                    },
                    parent: {
                        type: "Element",
                        name: { value: "aaa" },
                    },
                },
            },
        });
    }

    @test
    public testGetElementStack(): void {
        const completionContext = getCompletionContext('<aaa attr="content" attr2');
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeName,
            node: {
                type: "AttributeName",
                parent: {
                    parent: {
                        type: "Element",
                        attributes: {
                            length: 2,
                            [0]: { name: { value: "attr" } },
                            [1]: { name: { value: "attr2" } },
                        },
                    },
                },
            },
        });
    }

    @test
    public testGetElementStackWithSingleQuotedString(): void {
        const completionContext = getCompletionContext("<aaa attr='content' attr2");
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeName,
            node: {
                type: "AttributeName",
                parent: {
                    parent: {
                        type: "Element",
                        attributes: {
                            length: 2,
                            [0]: { name: { value: "attr" } },
                            [1]: { name: { value: "attr2" } },
                        },
                    },
                },
            },
        });
    }

    @test
    public testGetElementStackWithTwoItems(): void {
        const completionContext = getCompletionContext('<bbb attr2="zzz"><aaa attr="content" attr2');
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeName,
            node: {
                type: "AttributeName",
                parent: {
                    parent: {
                        type: "Element",
                        name: { value: "aaa" },
                        parent: {
                            type: "Element",
                            name: { value: "bbb" },
                        },
                    },
                },
            },
        });
    }

    @test
    public testGetElementStackWithClosingItem(): void {
        const completionContext = getCompletionContext('<xxx><yyy></yyy><bbb attr2="zzz"><aaa attr="content" attr2');
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeName,
            node: {
                type: "AttributeName",
                parent: {
                    parent: {
                        type: "Element",
                        name: { value: "aaa" },
                        parent: {
                            type: "Element",
                            name: { value: "bbb" },
                            parent: {
                                type: "Element",
                                name: { value: "xxx" },
                            },
                        },
                    },
                },
            },
        });
    }

    @test
    public testCompleteSecondAttributeValue(): void {
        const completionContext = getCompletionContext('<aaa attr="content" attr2');
        expect(completionContext).to.shallowDeepEqual({
            expectedToken: ExpectedTokenType.AttributeName,
            node: {
                type: "AttributeName",
                parent: {
                    parent: {
                        type: "Element",
                        attributes: {
                            length: 2,
                            [0]: { name: { value: "attr" } },
                            [1]: { name: { value: "attr2" } },
                        },
                    },
                },
            },
        });
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

    // private assertCompletionContext(
    //     completionContext: undefined | CompletionContext,
    //     expectedToken: ExpectedTokenType,
    //     elementContext: undefined | ElementContext,
    //     attributeContext?: undefined | AttributeContext
    // ): void {
    //     expect(completionContext != undefined).to.eql(true);
    //     if (completionContext != undefined) {
    //         expect(completionContext.expectedToken).to.eql(expectedToken);
    //         if (elementContext != undefined) {
    //             expect(completionContext.elementContext).to.eql(elementContext);
    //         }
    //         if (attributeContext != undefined) {
    //             expect(completionContext.attributeContext).to.eql(attributeContext);
    //         }
    //     }
    // }
}
