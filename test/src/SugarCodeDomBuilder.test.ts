import fs from "fs";
import { suite, test } from "mocha-typescript";
import path from "path";

import { OffsetToNodeMapBuilder } from "../../server/src/SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { SugarElement } from "../../server/src/SugarParsing/SugarGrammar/SugarParser";

import { expect } from "./Utils/Expect";

const xmlPreamble = `<?xml version="1.0" encoding="utf-8"?>`;

@suite
export class SugarCodeDomBuilderTest {
    @test
    public testNoElementAtPosition(): void {
        const codeDomBuilder = new OffsetToNodeMapBuilder();
        const positionToNodeMap = codeDomBuilder.buildOffsetToNodeMap(`<a b="value-b" />`);
        expect(positionToNodeMap.getNodeByOffset(0)).to.eql(undefined);
    }

    @test
    public testElementParentAtPosition(): void {
        const codeDomBuilder = new OffsetToNodeMapBuilder();
        const positionToNodeMap = codeDomBuilder.buildOffsetToNodeMap(`<o><a b="value-b" /></o>`);
        expect(positionToNodeMap.getNodeByOffset(4)).to.shallowDeepEqual({
            type: "ElementName",
            value: "a",
            parent: {
                type: "Element",
                parent: {
                    type: "Element",
                    name: {
                        value: "o",
                    },
                },
            },
        });
    }

    @test
    public testElementNameAtPosition(): void {
        const codeDomBuilder = new OffsetToNodeMapBuilder();
        const positionToNodeMap = codeDomBuilder.buildOffsetToNodeMap(`<a b="value-b" />`);
        const elementName = positionToNodeMap.getNodeByOffset(1);
        expect(elementName != undefined).to.eql(true);
        if (elementName != undefined) {
            expect(elementName.type).to.eql("ElementName");
            if (elementName.type === "ElementName") {
                expect(elementName.value).to.eql("a");
            }
        }
    }

    @test
    public testElementNameParentAtPosition(): void {
        const codeDomBuilder = new OffsetToNodeMapBuilder();
        const positionToNodeMap = codeDomBuilder.buildOffsetToNodeMap(`<a b="value-b" />`);
        const elementName = positionToNodeMap.getNodeByOffset(1);
        expect(elementName != undefined).to.eql(true);
        if (elementName != undefined) {
            expect(elementName.type).to.eql("ElementName");
            if (elementName.type === "ElementName") {
                expect(elementName.value).to.eql("a");
                expect(elementName.parent).to.shallowDeepEqual({
                    type: "Element",
                });
            }
        }
    }

    @test
    public testAttributeNameAtPosition(): void {
        const codeDomBuilder = new OffsetToNodeMapBuilder();
        const positionToNodeMap = codeDomBuilder.buildOffsetToNodeMap(`<a ab="value-b" />`);
        const elementName = positionToNodeMap.getNodeByOffset(3);
        expect(elementName != undefined).to.eql(true);
        if (elementName != undefined) {
            expect(elementName.type).to.eql("AttributeName");
            if (elementName.type === "AttributeName") {
                expect(elementName.value).to.eql("ab");
                expect(elementName.parent).to.shallowDeepEqual({
                    type: "Attribute",
                    parent: {
                        type: "Element",
                        name: {
                            value: "a",
                        },
                    },
                });
            }
        }
    }

    @test
    public testAttributeValueAtPosition(): void {
        const codeDomBuilder = new OffsetToNodeMapBuilder();
        const positionToNodeMap = codeDomBuilder.buildOffsetToNodeMap(`<a ab="value-b" />`);
        const elementName = positionToNodeMap.getNodeByOffset(7);
        expect(elementName != undefined).to.eql(true);
        if (elementName != undefined) {
            expect(elementName.type).to.eql("AttributeValue");
            if (elementName.type === "AttributeValue") {
                expect(elementName.value).to.eql("value-b");
                expect(elementName.parent).to.shallowDeepEqual({
                    type: "Attribute",
                    parent: {
                        type: "Element",
                        name: {
                            value: "a",
                        },
                    },
                });
            }
        }
    }

    @test
    public testParseRealSugar(): void {
        const codeDomBuilder = new OffsetToNodeMapBuilder();
        const positionToNodeMap = codeDomBuilder.buildOffsetToNodeMap(
            fs.readFileSync(path.join(__dirname, "RealData", "104812.sugar.xml"), "utf8")
        );
        expect(positionToNodeMap != undefined).to.eql(true);
    }

    @test
    public testNonMeaningfulCases(): void {
        this.checkIsValidSyntax(`<a b="value-b" /> `);
        this.checkIsValidSyntax(`<a b="value-b" />\n`);
        this.checkIsValidSyntax(`<a b="value-b" />\t`);
        this.checkIsValidSyntax(`\n<a b="value-b" />`);
        this.checkIsValidSyntax(`\r<a b="value-b" />`);
        this.checkIsValidSyntax(` <a b="value-b" />`);
        this.checkIsValidSyntax(`<a><!-- comment --><b /></a>`);
        this.checkIsValidSyntax(`<a>aaa<!-- comment -->aaa<b />aaa</a>`);
        this.checkIsValidSyntax(`   <!-- comment -->  <b />`);
        this.checkIsValidSyntax(`${xmlPreamble}<!-- comment --><b />`);
    }

    @test
    public testNamesWithDashes(): void {
        this.checkIsValidSyntax(`<a-a b-b="value-b" />`);
        this.checkIsValidSyntax(`<a_a b_b="value-b" />`);
    }

    @test
    public testAttributeNamespaces(): void {
        this.checkIsValidSyntax(`<a-a b:b="value-b" />`);
    }

    @test
    public testAttributeValueAsNumberArray(): void {
        this.checkIsValidSyntax(`<a b={[1, 2]} />`);
    }

    @test
    public testAttributeValueAsStringArray(): void {
        this.checkIsValidSyntax(`<a b={["1", "2"]} />`);
        this.checkIsValidSyntax(`<a b={["1", "\\"2"]} />`);
        this.checkIsValidSyntax(`<a b={["1", "/2"]} />`);
    }

    @test
    public testAttributeValueWithNestedArrays(): void {
        this.checkIsValidSyntax(`<a b={[ ["1"], [1]]} />`);
        this.checkIsValidSyntax(`<a b={ [ [ "1" ] , [ 1 ] ] } />`);
    }

    @test
    public testJavascriptObject(): void {
        this.checkIsValidSyntax(`<a b={ { "a": 1, b: "2" } } />`);
        this.checkIsValidSyntax(`<a b={ { "a": 1, b: "2", c: 1, "d": "2" } } />`);
    }

    @test
    public testSingleQuotedString(): void {
        this.checkIsValidSyntax(`<a b={ '\\'a' } />`);
    }

    @test
    public testBooleanValue(): void {
        this.checkIsValidSyntax(`<a b={ true } />`);
        this.checkIsValidSyntax(`<a b={true} />`);
    }

    @test
    public testNoSpaceAfterValue(): void {
        this.checkIsValidSyntax(`<a b={ true }z="1" />`);
        this.checkIsValidSyntax(`<a z="1"b={true} />`);
    }

    @test
    public testSingleQuotedStringValue(): void {
        this.checkIsValidSyntax(`<a b='1' />`);
    }

    @test
    public testRussianTagName(): void {
        this.checkIsValidSyntax(`<a b='1' />`);
    }

    @test
    public testPicklistSugarIsValid(): void {
        this.checkIsValidSyntax(`<picklist
            align="left"
            kind="button"
            gId="837"
            title="Код вида предпринимательской деятельности"
            width="240"
            path="КодВД"
            binding={ [["КодВД", "code1"], ["РасчНалВДАдр/БазДоход", "code2"]] }
            fields={ ["code1", "code2", "name1", "name2"] }
            headers={ ["Код", "Доходность", "Вид предпринимательской деятельности", "Физические показатели"] }
            columnsWidth={ [50, 90, 280, 190] }
            type="kodvd" 
        />`);
    }

    @test
    public testTableColumnsIsValid(): void {
        this.checkIsValidSyntax(`<table
        visibilityPath="../Таблица"
        crossfit="true"
        rowmenu="true"
        removebutton="false"
        doNotCopyPaths="НомерПор"
        columnGrouping={ [
          {"start": "4", "end": "5", "text": ["Испр. с-ф", "040 и 050","pencil" ]},
          {"start": "6", "end": "7", "text": ["Кор. с-ф", "060 и 070","pencil" ]},
          {"start": "8", "end": "9", "text": ["Испр. кор. с-ф", "080 и 090","pencil" ]},
          {"start": "15", "end": "16", "text": ["Посредник", "140","pencil" ]},
          {"start": "17", "end": "18", "text": ["Номер тамож.декл.", "150","pencil" ]},
          { start: 4, end: 11, showText: "Свернуть столбцы 040-110", hideText: "Столбцы 040-110" },
          { start: 15, end: 19, showText: "Свернуть столбцы 140-160", hideText: "Столбцы 140-160"  }
        ] }
        />`);
    }

    @test
    public testCodeDomForText(): void {
        this.checkCodeDom(`<a>text</a>`, {
            type: "Element",
            children: [
                {
                    type: "Text",
                    value: "text",
                },
            ],
        });
    }

    @test
    public testCodeDomForEmptyText(): void {
        this.checkCodeDom(`<a></a>`, {
            type: "Element",
            children: { length: 0 },
        });
        this.checkCodeDom(`<a> </a>`, {
            type: "Element",
            children: { length: 0 },
        });
        this.checkCodeDom(
            `<a>
</a>`,
            {
                type: "Element",
                children: { length: 0 },
            }
        );
        this.checkCodeDom(
            `<a>

</a>`,
            {
                type: "Element",
                children: { length: 0 },
            }
        );
    }

    @test
    public testCodeDomForComment(): void {
        this.checkCodeDom(`<a><!-- text --></a>`, {
            type: "Element",
            children: [
                {
                    type: "Comment",
                    text: " text ",
                },
            ],
        });
        this.checkCodeDom(`<a><!--a1--><b /><!--a1--><b /><!--a3--><b /></a>`, {
            type: "Element",
            children: {
                length: 6,
            },
        });
        this.checkCodeDom(`<a><!----></a>`, {
            type: "Element",
            children: [
                {
                    type: "Comment",
                    text: "",
                },
            ],
        });
        this.checkCodeDom(`<a><!-- test1\n    text1 --></a>`, {
            type: "Element",
            children: [
                {
                    type: "Comment",
                    text: " test1\n    text1 ",
                },
            ],
        });
    }

    @test
    public testCodeDomForJavascriptObjectLiterals(): void {
        this.checkCodeDom(`<a z={{  }} />`, {
            type: "Element",
            attributes: [
                {
                    name: { value: "z" },
                    value: {
                        value: {
                            type: "JavaScriptObjectLiteral",
                            properties: { length: 0 },
                        },
                    },
                },
            ],
        });
        this.checkCodeDom(`<a z={{ a: 1 }} />`, {
            type: "Element",
            attributes: [
                {
                    name: { value: "z" },
                    value: {
                        value: {
                            type: "JavaScriptObjectLiteral",
                            properties: [
                                {
                                    type: "JavaScriptObjectLiteralProperty",
                                    name: { type: "JavaScriptObjectLiteralPropertyName", value: "a" },
                                    value: { type: "JavaScriptNumberLiteral", value: 1 },
                                },
                            ],
                        },
                    },
                },
            ],
        });
        this.checkCodeDom(`<a z={{ a: 1, b: 2, c: 3 }} />`, {
            type: "Element",
            attributes: [
                {
                    value: {
                        value: {
                            properties: [
                                {
                                    name: { type: "JavaScriptObjectLiteralPropertyName", value: "a" },
                                    value: { type: "JavaScriptNumberLiteral", value: 1 },
                                },
                                {
                                    name: { type: "JavaScriptObjectLiteralPropertyName", value: "b" },
                                    value: { type: "JavaScriptNumberLiteral", value: 2 },
                                },
                                {
                                    name: { type: "JavaScriptObjectLiteralPropertyName", value: "c" },
                                    value: { type: "JavaScriptNumberLiteral", value: 3 },
                                },
                            ],
                        },
                    },
                },
            ],
        });
        this.checkCodeDom(`<a z={{ "a": 1, 'b': 2, c: 3 }} />`, {
            type: "Element",
            attributes: [
                {
                    value: {
                        value: {
                            properties: [
                                {
                                    name: {
                                        value: {
                                            type: "JavaScriptStringLiteral",
                                            value: "a",
                                        },
                                    },
                                    value: { type: "JavaScriptNumberLiteral", value: 1 },
                                },
                                {
                                    name: {
                                        value: {
                                            type: "JavaScriptStringLiteral",
                                            value: "b",
                                        },
                                    },
                                    value: { type: "JavaScriptNumberLiteral", value: 2 },
                                },
                                {
                                    name: { value: "c" },
                                    value: { type: "JavaScriptNumberLiteral", value: 3 },
                                },
                            ],
                        },
                    },
                },
            ],
        });
    }

    @test
    public testCodeDomForJavascriptArrayLiterals(): void {
        this.checkCodeDom(`<a z={[1]} />`, {
            type: "Element",
            attributes: [
                {
                    name: { value: "z" },
                    value: {
                        value: {
                            type: "JavaScriptArrayLiteral",
                            values: [{ value: 1 }],
                        },
                    },
                },
            ],
        });
        this.checkCodeDom(`<a z={[1, 2]} />`, {
            type: "Element",
            attributes: [
                {
                    value: {
                        value: {
                            values: [{ value: 1 }, { value: 2 }],
                        },
                    },
                },
            ],
        });
        this.checkCodeDom(`<a z={[1, 2, 3]} />`, {
            type: "Element",
            attributes: [
                {
                    value: {
                        value: {
                            values: [{ value: 1 }, { value: 2 }, { value: 3 }],
                        },
                    },
                },
            ],
        });
    }

    @test
    public testCodeDomForJavascriptLiterals(): void {
        this.checkCodeDom(`<a z={"a"} />`, {
            type: "Element",
            attributes: [
                {
                    name: { value: "z" },
                    value: {
                        type: "AttributeJavaScriptValue",
                        value: {
                            type: "JavaScriptStringLiteral",
                            value: "a",
                        },
                    },
                },
            ],
        });
        this.checkCodeDom(`<a z={'a'} />`, {
            type: "Element",
            attributes: [
                {
                    name: { value: "z" },
                    value: {
                        type: "AttributeJavaScriptValue",
                        value: {
                            type: "JavaScriptStringLiteral",
                            value: "a",
                        },
                    },
                },
            ],
        });
        this.checkCodeDom(`<a z={true} />`, {
            type: "Element",
            attributes: [
                {
                    name: { value: "z" },
                    value: {
                        type: "AttributeJavaScriptValue",
                        value: {
                            type: "JavaScriptBooleanLiteral",
                            value: true,
                        },
                    },
                },
            ],
        });
        this.checkCodeDom(`<a z={false} />`, {
            type: "Element",
            attributes: [
                {
                    name: { value: "z" },
                    value: {
                        type: "AttributeJavaScriptValue",
                        value: {
                            type: "JavaScriptBooleanLiteral",
                            value: false,
                        },
                    },
                },
            ],
        });
        this.checkCodeDom(`<a z={222222222} />`, {
            type: "Element",
            attributes: [
                {
                    name: { value: "z" },
                    value: {
                        type: "AttributeJavaScriptValue",
                        value: {
                            type: "JavaScriptNumberLiteral",
                            value: 222222222,
                        },
                    },
                },
            ],
        });
    }

    private checkCodeDom(input: string, expectedCodeDom: DeepPartial<SugarElement>): void {
        const codeDomBuilder = new OffsetToNodeMapBuilder();
        const codeDome = codeDomBuilder.buildCodeDom(input);
        expect(codeDome).to.shallowDeepEqual(expectedCodeDom);
    }

    private checkIsValidSyntax(input: string): void {
        const codeDomBuilder = new OffsetToNodeMapBuilder();
        codeDomBuilder.buildOffsetToNodeMap(input);
    }
}

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? (Array<DeepPartial<U>> | { length?: number; [key: number]: DeepPartial<U> })
        : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]>
};
