import { suite, test } from "mocha-typescript";

import { SugarCodeDomBuilder } from "../../server/src/SugarCodeDomBuilder/SugarCodeDomBuilder";

import { expect } from "./Expect";

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
}
