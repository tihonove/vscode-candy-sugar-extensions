import { suite, test } from "mocha-typescript";

import { PositionToNodeMap, SugarCodeDomBuilder } from "../../server/src/SugarCodeDomBuilder/SugarCodeDomBuilder";
import { SugarAttributeInfo, SugarElementInfo } from "../../server/src/Suggester/SugarElementInfo";

import { expect } from "./Utils/Expect";
import { testSugarElementInfos } from "./Utils/TestInfos";

@suite
export class ContextAtCursorResolverTest {
    @test
    public testElementNameContext(): void {
        expect(this.getElementNameContext(`<|atag1 ab="value" />`)).to.shallowDeepEqual({
            name: "atag1",
        });
        expect(this.getElementNameContext(`<atag|1 ab="value" />`)).to.shallowDeepEqual({
            name: "atag1",
        });
        expect(this.getElementNameContext(`<atag1| ab="value" />`)).to.shallowDeepEqual({
            name: "atag1",
        });
        expect(this.getElementNameContext(`<atag1 a|b="value" />`)).to.eql(undefined);
        expect(this.getElementNameContext(`<atag1 |ab="value" />`)).to.eql(undefined);
        expect(this.getElementNameContext(`|<atag1 ab="value" />`)).to.eql(undefined);
    }

    @test
    public testAttributeNameContext(): void {
        expect(this.getAttributeNameContext(`<atag1 |path="value" />`)).to.shallowDeepEqual([
            {
                name: "atag1",
            },
            {
                name: "path",
            },
        ]);
    }

    @test
    public testDataAttributeValueContext(): void {
        expect(this.getDataAttributeValueContext(`<atag1 path="Root|/Item" />`)).to.shallowDeepEqual([
            {
                name: "atag1",
            },
            {
                name: "path",
            },
        ]);
    }

    private getElementNameContext(inputWithCursor: string): undefined | SugarElementInfo {
        const cursorOffset = inputWithCursor.indexOf("|");
        const input = inputWithCursor.replace("|", "");
        const contextAtCursorResolver = new ContextAtCursorResolver(testSugarElementInfos);
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(input);
        return contextAtCursorResolver.resolveElementInfo(positionToNodeMap, cursorOffset);
    }

    private getAttributeNameContext(
        inputWithCursor: string
    ): undefined | [SugarElementInfo, undefined | SugarAttributeInfo] {
        const cursorOffset = inputWithCursor.indexOf("|");
        const input = inputWithCursor.replace("|", "");
        const contextAtCursorResolver = new ContextAtCursorResolver(testSugarElementInfos);
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(input);
        return contextAtCursorResolver.resolveAttributeInfo(positionToNodeMap, cursorOffset);
    }
}

class ContextAtCursorResolver {
    private readonly sugarElementInfos: SugarElementInfo[];

    public constructor(sugarElementInfos: SugarElementInfo[]) {
        this.sugarElementInfos = sugarElementInfos;
    }

    public resolveAttributeInfo(
        positionToNodeMap: PositionToNodeMap,
        cursorOffset: number
    ): undefined | [SugarElementInfo, undefined | SugarAttributeInfo] {
        throw new Error("Method not implemented.");
    }

    public resolveElementInfo(
        positionToNodeMap: PositionToNodeMap,
        cursorOffset: number
    ): undefined | SugarElementInfo {
        const node = positionToNodeMap.getNodeByOffset(cursorOffset);
        if (node == undefined) {
            return undefined;
        }
        if (node.type === "ElementName") {
            return this.sugarElementInfos.find(x => x.name === node.value);
        }
        return undefined;
    }
}
