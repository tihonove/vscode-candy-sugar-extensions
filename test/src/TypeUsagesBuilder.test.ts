import { suite, test } from "mocha-typescript";

import { OffsetToNodeMapBuilder } from "../../server/src/SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { TypeInfoExtractor } from "../../server/src/SugarAnalyzing/TypeInfoExtraction/TypeInfoExtractor";
import { UserDefinedTypeUsagesBuilder } from "../../server/src/SugarAnalyzing/UserDefinedTypeUsagesAnalizing/UserDefinedTypeUsagesBuilder";
import { UserDefinedTypeUsagesInfo } from "../../server/src/SugarAnalyzing/UserDefinedTypeUsagesAnalizing/UserDefinedTypeUsagesInfo";

import { expect } from "./Utils/Expect";
import { testSugarElementInfos } from "./Utils/TestInfos";

@suite
export class UserDefinedTypeUsagesBuilderTest {
    @test
    public testSingleTypeUsages(): void {
        const usages = this.buildTypeUsages(`
            <form>
                <types>
                    <type name="type-1" base="string"></type>
                </types>
                <page>
                    <atag1 path="Root" type="type-1" />                
                </page>
            </form>
        `);
        expect(usages).to.shallowDeepEqual([
            {
                type: { name: "type-1" },
                usages: [
                    {
                        attributeValueNode: {
                            value: "type-1",
                        },
                        typeUsagePosition: {
                            start: { offset: 198 },
                            end: { offset: 206 },
                        },
                        elementPosition: {
                            start: { offset: 174 },
                            end: { offset: 209 },
                        },
                    },
                ],
            },
        ]);
    }

    private buildTypeUsages(input: string): UserDefinedTypeUsagesInfo[] {
        const builder = new OffsetToNodeMapBuilder();
        const sugarDocument = builder.buildCodeDom(input);
        const typeInfoExtractor = new TypeInfoExtractor();
        const userDefinedTypes = typeInfoExtractor.extractTypeInfos(sugarDocument);
        const usagesBuilder = new UserDefinedTypeUsagesBuilder(testSugarElementInfos);
        return usagesBuilder.buildUsages(userDefinedTypes, sugarDocument);
    }
}
