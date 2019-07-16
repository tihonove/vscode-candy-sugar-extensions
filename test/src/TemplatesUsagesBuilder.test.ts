import { suite, test } from "mocha-typescript";

import { OffsetToNodeMapBuilder } from "../../server/src/SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { TemplatesExtractor } from "../../server/src/SugarAnalyzing/TemplatesExtraction/TemplatesExtractor";
import { UserDefinedTemplateUsagesBuilder } from "../../server/src/SugarAnalyzing/UserDefinedTemplateUsagesAnalizing/UserDefinedTemplateUsagesBuilder";
import { UserDefinedTemplateUsagesInfo } from "../../server/src/SugarAnalyzing/UserDefinedTemplateUsagesAnalizing/UserDefinedTemplateUsagesInfo";

import { TestProjectContext } from "./TestProjectContext";
import { expect } from "./Utils/Expect";
import { testTemplatesSugarElementInfos } from "./Utils/TestInfos";

@suite
export class UserDefinedTypeUsagesBuilderTest {
    @test
    public testSingleTemplateUsages(): void {
        const usages = this.buildTemplatesUsages(`
            <form>
                <templates>
                    <template name="templateName" />
                </templates>
                <page>
                    <templateName />                
                </page>
            </form>
        `);
        expect(usages).to.shallowDeepEqual([
            {
                source: { name: "templateName" },
                usages: [
                    {
                        elementPosition: {
                            start: { offset: 173 },
                            end: { offset: 189 },
                        },
                    },
                ],
            },
        ]);
    }

    @test
    public testWithAnotherFiles(): void {
        const usages = this.buildTemplatesUsages(
            `
            <form>
                <templates>
                    <template name="templateName" />
                </templates>
                <page>
                    <templateName />                
                </page>
            </form>
        `,
            "currentFile.sugar.xml",
            { "anotherFile.sugar.xml": `<form><templateName /></form>` }
        );
        expect(usages).to.shallowDeepEqual([
            {
                source: { name: "templateName" },
                usages: [
                    {
                        elementPosition: {
                            start: { offset: 173 },
                            end: { offset: 189 },
                        },
                        absoluteSugarFilePath: "currentFile.sugar.xml",
                    },
                    {
                        elementPosition: {
                            start: { offset: 6 },
                            end: { offset: 22 },
                        },
                        absoluteSugarFilePath: "anotherFile.sugar.xml",
                    },
                ],
            },
        ]);
    }

    private buildTemplatesUsages(
        input: string,
        currentFile: string = "",
        files: { [filePath: string]: string } = {}
    ): UserDefinedTemplateUsagesInfo {
        const builder = new OffsetToNodeMapBuilder();
        const sugarDocument = builder.buildCodeDom(input);
        const templateInfoExtractor = new TemplatesExtractor();
        const userDefinedTemplates = templateInfoExtractor.extractTemplates(sugarDocument, currentFile);
        const usagesBuilder = new UserDefinedTemplateUsagesBuilder(testTemplatesSugarElementInfos);
        const sugarDoms = {};
        sugarDoms[currentFile] = sugarDocument;
        for (const filePath of Object.keys(files)) {
            sugarDoms[filePath] = builder.buildCodeDom(files[filePath]);
        }
        const projectContext = new TestProjectContext(sugarDoms);
        return usagesBuilder.buildTemplateUsages(userDefinedTemplates, projectContext);
    }
}
