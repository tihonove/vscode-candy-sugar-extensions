import { suite, test } from "mocha-typescript";

import { TypeInfoExtractor } from "../../server/src/SugarAnalyzing/TypeInfoExtraction/TypeInfoExtractor";
import { UsedDefinedSugarTypeInfo } from "../../server/src/SugarElements/UsedDefinedSugarTypeInfo";
import { parseSugar } from "../../server/src/SugarParsing/SugarGrammar/SugarParser";
import { NullTracer } from "../../server/src/Utils/PegJSUtils/NullTracer";

import { expect } from "./Utils/Expect";

@suite
export class UserDefinedTypeInfoExtractorTest {
    @test
    public extractFromEmptyTypes(): void {
        const typeInfos = this.extractTypeInfos("<form></form>");
        expect(typeInfos).to.eql([]);
    }

    @test
    public extractSingleType(): void {
        const typeInfos = this.extractTypeInfos(`<page>
<types>
    <type name="typeName" base="string" description="Description" requiredDescription="RequiredDescription">
        <length value="9" />
        <pattern value="([0-9]{1}[1-9]{1}|[1-9]{1}[0-9]{1})([0-9]{2})(35|77)([0-9]{3})" />
    </type>
</types>
</page>`);
        expect(typeInfos).to.shallowDeepEqual([
            {
                name: "typeName",
                baseName: "string",
                description: "Description",
                requiredDescription: "RequiredDescription",
                constraintStrings: [
                    '<length value="9" />',
                    '<pattern value="([0-9]{1}[1-9]{1}|[1-9]{1}[0-9]{1})([0-9]{2})(35|77)([0-9]{3})" />',
                ],
                position: {
                    start: { offset: 19 },
                    end: { offset: 255 },
                },
            },
        ]);
    }

    private extractTypeInfos(input: string): UsedDefinedSugarTypeInfo[] {
        const typeInfoExtractor = new TypeInfoExtractor();
        const parseResult = parseSugar(input, {
            tracer: new NullTracer(),
        });
        const typeInfos = typeInfoExtractor.extractTypeInfos(parseResult);
        return typeInfos;
    }
}
