import fs from "fs";
import { suite, test } from "mocha-typescript";
import path from "path";

import { SugarCodeDomBuilder } from "../../server/src/SugarCodeDomBuilder/SugarCodeDomBuilder";

import { expect } from "./Utils/Expect";

@suite
export class SugarCodeDomBuilderTest {
    @test
    public testNoElementAtPosition(): void {
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(`<a b="value-b" />`);
        expect(positionToNodeMap.getNodeByOffset(0)).to.eql(undefined);
    }

    @test
    public testElementParentAtPosition(): void {
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(`<o><a b="value-b" /></o>`);
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
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(`<a b="value-b" />`);
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
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(`<a b="value-b" />`);
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
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(`<a ab="value-b" />`);
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
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(`<a ab="value-b" />`);
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
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(
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
    }

    @test
    public testNamesWithDashes(): void {
        this.checkIsValidSyntax(`<a-a b-b="value-b" />`);
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

    private checkIsValidSyntax(input: string): void {
        const codeDomBuilder = new SugarCodeDomBuilder();
        codeDomBuilder.buildPositionToNodeMap(input);
    }
}
