import * as fse from "fs-extra";
import * as path from "path";
import rimraf from "rimraf";

import { SugarElementGroupInfo } from "../../server/src/SugarElements/SugarElementGroupInfo";
import { SugarElementInfo } from "../../server/src/SugarElements/SugarElementInfo";

export class SugarDocumentationGenerator {
    private readonly outputDir: string;

    public constructor(outputDir: string) {
        this.outputDir = outputDir;
    }

    public generateGroups(sugarElementsGroups: SugarElementGroupInfo[]): void {
        rimraf.sync(this.outputDir);
        this.copyTemplate();
        for (const sugarElementsGroup of sugarElementsGroups) {
            this.generateGroupDocs(sugarElementsGroup);
        }
        fse.writeFileSync(path.join(this.outputDir, "_sidebar.md"), this.generateSidebar(sugarElementsGroups), "utf8");
    }

    public generateGroupDocs(sugarElementsGroup: SugarElementGroupInfo): void {
        const targetDirPath = path.join(this.outputDir, sugarElementsGroup.name);
        fse.copySync(sugarElementsGroup.descriptionPath, path.join(targetDirPath, `${sugarElementsGroup.name}.md`));
        for (const element of sugarElementsGroup.elements) {
            this.generateElementDoc(sugarElementsGroup, element);
        }
    }

    private copyTemplate(): void {
        const sourceDocsTemplateDir = path.join(__dirname, "DocsTemplate");
        const templateFiles = fse.readdirSync(sourceDocsTemplateDir);
        for (const templateFile of templateFiles) {
            fse.copyFileSync(path.join(sourceDocsTemplateDir, templateFile), path.join(this.outputDir, templateFile));
        }
    }

    private buildElementEditOnGithubUrl(sugarElementsGroup: SugarElementGroupInfo, element: SugarElementInfo): string {
        return `https://github.com/tihonove/vscode-candy-sugar-extensions/edit/master/server/src/SugarElements/DefaultSugarElementInfos/${
            sugarElementsGroup.name
        }/${element.name}.ts`;
    }

    private generateElementDoc(sugarElementsGroup: SugarElementGroupInfo, element: SugarElementInfo): void {
        const targetDirPath = path.join(this.outputDir, sugarElementsGroup.name);
        fse.writeFileSync(
            path.join(targetDirPath, `${element.name}.md`),
            this.generateElementDocContent(sugarElementsGroup, element),
            "utf8"
        );
    }

    private generateSidebar(sugarElementsGroups: SugarElementGroupInfo[]): string {
        let result = "";
        result += "* [Home](/README.md)\n";
        result += "* Элементы\n";
        for (const group of sugarElementsGroups) {
            result += `  * [${group.caption}](${group.name}/${group.name}.md)\n`;
            for (const element of group.elements) {
                result += `    * [${element.name}](${group.name}/${element.name}.md)\n`;
            }
        }
        return result;
    }

    private generateElementDocContent(sugarElementsGroups: SugarElementGroupInfo, element: SugarElementInfo): string {
        let result = `# ${element.name}\n`;
        result += `[:memo: Edit on github](${this.buildElementEditOnGithubUrl(sugarElementsGroups, element)})\n\n`;
        if (element.markdownDescription != undefined) {
            result += `${element.markdownDescription}\n` || "\n";
        }
        result += "\n";
        result += "## Атрибуты\n";
        for (const attribute of element.attributes || []) {
            result += `### \`${attribute.name}\`\n`;
            const description = attribute.markdownDescription || attribute.shortMarkdownDescription;
            if (description != undefined) {
                result += description + "\n";
            }
            result += "\n";
        }
        return result;
    }
}
