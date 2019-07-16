import { suite, test } from "mocha-typescript";

import { TemplatesExtractor } from "../../server/src/SugarAnalyzing/TemplatesExtraction/TemplatesExtractor";
import { SugarElementInfo, TemplateParameterType } from "../../server/src/SugarElements/SugarElementInfo";
import { parseSugar } from "../../server/src/SugarParsing/SugarGrammar/SugarParser";
import { NullTracer } from "../../server/src/Utils/PegJSUtils/NullTracer";

import { expect } from "./Utils/Expect";

@suite
export class UserDefinedTemplatesExtractorTest {
    @test
    public extractFromEmptyTemplates(): void {
        const templates = this.extractTemplates("<form></form>");
        expect(templates).to.eql([]);
    }

    @test
    public extractSingleTemplate(): void {
        const templates = this.extractTemplates(`
<form>
    <templates>
        <template name="templateName">
            <params>
                <param name="param" type="string" required="true" />
            </params>
            <body></body>
        </template>
    </templates>
</form>
`);
        expect(templates).to.shallowDeepEqual([
            {
                name: "templateName",
                attributes: [{ name: "param", valueTypes: [TemplateParameterType.String], optional: false }],
            },
        ]);
    }

    @test
    public extractSingleTemplateAndFewParams(): void {
        const templates = this.extractTemplates(`
<form>
    <templates>
        <template name="templateName">
            <params>
                <param name="param1" type="string" required="true" />
                <param name="param2" type="sugar" required="false" />
            </params>
            <body></body>
        </template>
    </templates>
</form>
`);
        expect(templates).to.shallowDeepEqual([
            {
                name: "templateName",
                attributes: [
                    { name: "param1", valueTypes: [TemplateParameterType.String], optional: false },
                    { name: "param2", valueTypes: [TemplateParameterType.Sugar], optional: true },
                ],
            },
        ]);
    }

    @test
    public extractFewTemplates(): void {
        const templates = this.extractTemplates(`
<form>
    <templates>
        <template name="templateName1">
            <params>
                <param name="param1" type="string" required="true" />
            </params>
            <body></body>
        </template>
        <template name="templateName2">
            <params>
                <param name="param2" type="sugar" required="false" />
            </params>
            <body></body>
        </template>
        <template name="templateName3">
            <params>
                <param name="param3" type="string" required="true" />
            </params>
            <body></body>
        </template>
    </templates>
</form>
`);
        expect(templates).to.shallowDeepEqual([
            {
                name: "templateName1",
                attributes: [{ name: "param1", valueTypes: [TemplateParameterType.String], optional: false }],
            },
            {
                name: "templateName2",
                attributes: [{ name: "param2", valueTypes: [TemplateParameterType.Sugar], optional: true }],
            },
            {
                name: "templateName3",
                attributes: [{ name: "param3", valueTypes: [TemplateParameterType.String], optional: false }],
            },
        ]);
    }

    private extractTemplates(sugar: string): SugarElementInfo[] {
        const templatesExtractor = new TemplatesExtractor();
        const parseResult = parseSugar(sugar, {
            tracer: new NullTracer(),
        });
        return templatesExtractor.extractElements(parseResult);
    }
}
