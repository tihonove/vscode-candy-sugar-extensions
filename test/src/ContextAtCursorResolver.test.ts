import { suite, test } from "mocha-typescript";

import { ContextAtCursorResolver, CursorContext } from "../../server/src/SugarCodeDomBuilder/ContextAtCursorResolver";
import { SugarCodeDomBuilder } from "../../server/src/SugarCodeDomBuilder/SugarCodeDomBuilder";
import { SugarElementInfo } from "../../server/src/Suggester/SugarElementInfo";

import { expect } from "./Utils/Expect";
import { testSugarElementInfos } from "./Utils/TestInfos";

@suite
export class ContextAtCursorResolverTest {
    @test
    public testCursorContext(): void {
        expect(this.getCursorContext(`<atag|1 ab="value" />`)).to.shallowDeepEqual({
            type: "ElementName",
            currentElementInfo: {
                name: "atag1",
            },
            dataContext: [],
            elementStack: [
                {
                    type: "Element",
                    name: { value: "atag1" },
                },
            ],
        });
    }

    @test
    public testNestedTags(): void {
        expect(this.getCursorContext(`<atag2><atag|1 ab="value" /></atag2>`)).to.shallowDeepEqual({
            type: "ElementName",
            currentElementInfo: {
                name: "atag1",
            },
            dataContext: [],
            elementStack: [
                {
                    type: "Element",
                    name: { value: "atag2" },
                },
                {
                    type: "Element",
                    name: { value: "atag1" },
                },
            ],
        });
    }

    @test
    public testNestedTagsContext(): void {
        expect(this.getCursorContext(`<ctag3 path="Root"><atag|1 ab="value" /></ctag3>`)).to.shallowDeepEqual({
            type: "ElementName",
            currentElementInfo: {
                name: "atag1",
            },
            dataContext: ["Root"],
            elementStack: [
                {
                    type: "Element",
                    name: { value: "ctag3" },
                },
                {
                    type: "Element",
                    name: { value: "atag1" },
                },
            ],
        });
    }

    @test
    public testNestedTagsContextWithAbsolutePath(): void {
        expect(this.getCursorContext(`<ctag3 path="/Root"><atag|1 ab="value" /></ctag3>`)).to.shallowDeepEqual({
            type: "ElementName",
            currentElementInfo: {
                name: "atag1",
            },
            dataContext: ["Root"],
            elementStack: [
                {
                    type: "Element",
                    name: { value: "ctag3" },
                },
                {
                    type: "Element",
                    name: { value: "atag1" },
                },
            ],
        });
    }

    @test
    public testNestedTagsContextWithAbsolutePath_AttributeValue(): void {
        expect(this.getCursorContext(`<ctag3 path="/Root"><atag1 ab="v|alue" /></ctag3>`)).to.shallowDeepEqual({
            dataContext: ["Root"],
        });
    }

    @test
    public testMultipleNestedTagsContext(): void {
        expect(
            this.getCursorContext(
                `<ctag3 path="Root/Child1"><ctag3 path="Child2/Child3"><atag|1 ab="value" /></ctag3></ctag3>`
            )
        ).to.shallowDeepEqual({
            type: "ElementName",
            currentElementInfo: {
                name: "atag1",
            },
            dataContext: ["Root", "Child1", "Child2", "Child3"],
            elementStack: [
                {
                    type: "Element",
                    name: { value: "ctag3" },
                },
                {
                    type: "Element",
                    name: { value: "ctag3" },
                },
                {
                    type: "Element",
                    name: { value: "atag1" },
                },
            ],
        });
    }

    @test
    public testAttributeContext(): void {
        expect(
            this.getCursorContext(
                `<ctag3 path="Root/Child1"><ctag3 path="Child2/Child3"><atag1 a|b="value" /></ctag3></ctag3>`
            )
        ).to.shallowDeepEqual({
            type: "AttributeName",
            currentElementInfo: {
                name: "atag1",
            },
            dataContext: ["Root", "Child1", "Child2", "Child3"],
            elementStack: [
                {
                    type: "Element",
                    name: { value: "ctag3" },
                },
                {
                    type: "Element",
                    name: { value: "ctag3" },
                },
                {
                    type: "Element",
                    name: { value: "atag1" },
                },
            ],
        });
    }

    @test
    public testDataAttributeValueContext(): void {
        expect(
            this.getCursorContext(
                `<ctag3 path="Root/Child1"><ctag3 path="Child2/Child3"><atag1 path="Chil|d4/Child5" /></ctag3></ctag3>`
            )
        ).to.shallowDeepEqual({
            type: "DataAttributeValue",
            currentElementInfo: {
                name: "atag1",
            },
            dataContext: ["Root", "Child1", "Child2", "Child3"],
            currentDataContext: { length: 6, ...["Root", "Child1", "Child2", "Child3", "Child4", "Child5"] },
            elementStack: [
                {
                    type: "Element",
                    name: { value: "ctag3" },
                },
                {
                    type: "Element",
                    name: { value: "ctag3" },
                },
                {
                    type: "Element",
                    name: { value: "atag1" },
                },
            ],
        });
    }

    @test
    public "Дата-атрибуты с переходом на верхний уровень"(): void {
        expect(
            this.getCursorContext(
                `<ctag3 path="Root/Child2"><ctag3 path="../Child1/Child2/Child3"><atag1 path="Chil|d4/Child5" /></ctag3></ctag3>`
            )
        ).to.shallowDeepEqual({
            type: "DataAttributeValue",
            currentElementInfo: {
                name: "atag1",
            },
            dataContext: ["Root", "Child1", "Child2", "Child3"],
            currentDataContext: { length: 6, ...["Root", "Child1", "Child2", "Child3", "Child4", "Child5"] },
            elementStack: [
                {
                    type: "Element",
                    name: { value: "ctag3" },
                },
                {
                    type: "Element",
                    name: { value: "ctag3" },
                },
                {
                    type: "Element",
                    name: { value: "atag1" },
                },
            ],
        });
    }

    @test
    public testDataAttributeValueContextWithAbsolutePathInRoot(): void {
        expect(
            this.getCursorContext(
                `<ctag3 path="/Root/Child1"><ctag3 path="Child2/Child3"><atag1 path="Chil|d4/Child5" /></ctag3></ctag3>`
            )
        ).to.shallowDeepEqual({
            dataContext: ["Root", "Child1", "Child2", "Child3"],
            currentDataContext: { length: 6, ...["Root", "Child1", "Child2", "Child3", "Child4", "Child5"] },
        });
    }

    @test
    public testDataAttributeValueContextWithAbsolutePathInChild(): void {
        expect(
            this.getCursorContext(
                `<ctag3 path="/Root/Child2"><ctag3 path="/Root/Child1/Child2/Child3"><atag1 path="Chil|d4/Child5" /></ctag3></ctag3>`
            )
        ).to.shallowDeepEqual({
            dataContext: ["Root", "Child1", "Child2", "Child3"],
            currentDataContext: { length: 6, ...["Root", "Child1", "Child2", "Child3", "Child4", "Child5"] },
        });
    }

    @test
    public testDataAttributeValueContext_NoCurrentDataContext(): void {
        expect(
            this.getCursorContext(`<btag2><btag2><atag1 path="Roo|t/Child1" /></btag2></btag2>`)
        ).to.shallowDeepEqual({
            type: "DataAttributeValue",
            currentElementInfo: {
                name: "atag1",
            },
            dataContext: [],
            currentDataContext: { length: 2, ...["Root", "Child1"] },
            elementStack: [
                {
                    type: "Element",
                    name: { value: "btag2" },
                },
                {
                    type: "Element",
                    name: { value: "btag2" },
                },
                {
                    type: "Element",
                    name: { value: "atag1" },
                },
            ],
        });
    }

    private getCursorContext(inputWithCursor: string, sugarElements?: SugarElementInfo[]): undefined | CursorContext {
        const cursorOffset = inputWithCursor.indexOf("|");
        const input = inputWithCursor.replace("|", "");
        const contextAtCursorResolver = new ContextAtCursorResolver(sugarElements || testSugarElementInfos);
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(input);
        return contextAtCursorResolver.resolveContext(positionToNodeMap, cursorOffset);
    }
}
