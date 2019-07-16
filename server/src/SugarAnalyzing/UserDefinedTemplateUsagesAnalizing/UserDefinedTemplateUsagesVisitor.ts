import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTemplateInfo } from "../../SugarElements/UserDefinedSugarTemplateInfo";
import { SugarElementName } from "../../SugarParsing/SugarGrammar/SugarParser";
import { EmptySugarDomVisitor } from "../Traversing/EmptySugarDomVisitor";

import { UserDefinedTemplateUsagesInfo } from "./UserDefinedTemplateUsagesInfo";

export class UserDefinedTemplateUsagesVisitor extends EmptySugarDomVisitor {
    private readonly usages: UserDefinedTemplateUsagesInfo;
    private readonly sugarElementInfos: SugarElementInfo[];
    private readonly userDefinedTemplates: UserDefinedSugarTemplateInfo[];

    public currentlyTraversingFilePath?: string;

    public constructor(userDefinedTemplates: UserDefinedSugarTemplateInfo[], sugarElementInfos: SugarElementInfo[]) {
        super();
        this.sugarElementInfos = sugarElementInfos;
        this.userDefinedTemplates = userDefinedTemplates;
        this.usages = this.userDefinedTemplates.map(x => ({ source: x, usages: [] }));
    }

    public getUsages(): UserDefinedTemplateUsagesInfo {
        return this.usages;
    }

    public visitElementName(elementName: SugarElementName): void {
        if (this.currentlyTraversingFilePath === undefined) {
            throw new Error("currentlyTraversingFilePath should be not null");
        }
        if (!this.sugarElementInfos.find(x => x.name === elementName.value)) {
            return;
        }
        const userDefinedTemplate = this.userDefinedTemplates.find(x => x.name === elementName.value);
        if (userDefinedTemplate == undefined) {
            return;
        }
        let usageInfo = this.usages.find(x => x.source === userDefinedTemplate);
        if (usageInfo == undefined) {
            usageInfo = { source: userDefinedTemplate, usages: [] };
            this.usages.push(usageInfo);
        }
        usageInfo.usages.push({
            elementPosition: elementName.parent.position,
            absoluteSugarFilePath: this.currentlyTraversingFilePath,
        });
        return;
    }
}
