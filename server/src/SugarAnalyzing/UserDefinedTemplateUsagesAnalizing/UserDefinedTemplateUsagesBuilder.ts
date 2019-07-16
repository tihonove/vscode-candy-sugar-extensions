import { Location } from "vscode-languageserver-types";

import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTemplateInfo } from "../../SugarElements/UserDefinedSugarTemplateInfo";
import { ISugarProjectContext } from "../../Validator/Validator/ISugarProjectContext";
import { CodeContext } from "../ContextResolving/CodeContext";
import { ReferencesBuilder } from "../ReferencesBuilder";
import { traverseSugar } from "../Traversing/TraverseSugar";

import { UserDefinedTemplateUsagesInfo } from "./UserDefinedTemplateUsagesInfo";
import { UserDefinedTemplateUsagesVisitor } from "./UserDefinedTemplateUsagesVisitor";

export class UserDefinedTemplateUsagesBuilder extends ReferencesBuilder {
    private readonly sugarElementInfos: SugarElementInfo[];

    public constructor(sugarElementInfos: SugarElementInfo[]) {
        super();
        this.sugarElementInfos = sugarElementInfos;
    }

    public buildTemplateUsages(
        userDefinedTemplates: UserDefinedSugarTemplateInfo[],
        projectContext: ISugarProjectContext
    ): UserDefinedTemplateUsagesInfo {
        const visitor = new UserDefinedTemplateUsagesVisitor(userDefinedTemplates, this.sugarElementInfos);
        for (const projectFilePath of projectContext.getAllProjectFilePaths()) {
            visitor.currentlyTraversingFilePath = projectFilePath;
            traverseSugar(projectContext.getSugarDomByFilePath(projectFilePath), visitor);
        }

        return visitor.getUsages();
    }

    public findReferences(context: CodeContext, usagesGroups: UserDefinedTemplateUsagesInfo): Location[] {
        const templateElement = this.findNearestElementByName(context.contextNode, "template");
        const templateName = this.getValueAttributeByName(templateElement, "name");
        if (templateName != undefined && usagesGroups != undefined) {
            const usages = usagesGroups.find(x => x.source.name === templateName);
            if (usages != undefined) {
                return this.mapUsages(usages.usages);
            }
        }
        return [];
    }
}
