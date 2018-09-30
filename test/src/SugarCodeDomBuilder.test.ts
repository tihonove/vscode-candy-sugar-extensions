import { suite, test } from "mocha-typescript";

import { SugarCodeDomBuilder } from "../../server/src/SugarCodeDomBuilder/SugarCodeDomBuilder";

import { expect} from "./Expect";

@suite
export class SugarCodeDomBuilderTest {
    @test
    public testNoElementAtPosition(): void {
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(`<a b="value-b" />`);
        expect(positionToNodeMap.getNodeByOffset(0)).to.eql(undefined);
    }

    @test
    public testElementNameAtPosition(): void {
        const codeDomBuilder = new SugarCodeDomBuilder();
        const positionToNodeMap = codeDomBuilder.buildPositionToNodeMap(`<a b="value-b" />`);
        const elementName = positionToNodeMap.getNodeByOffset(1);
        expect(elementName instanceof SugarElementName).to.eql(true);
    }
}
