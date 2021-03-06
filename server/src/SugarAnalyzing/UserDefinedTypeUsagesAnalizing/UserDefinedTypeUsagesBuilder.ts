import { Location } from "vscode-languageserver-types";

import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { ISugarProjectContext } from "../../Validator/Validator/ISugarProjectContext";
import { CodeContext } from "../ContextResolving/CodeContext";
import { ReferencesBuilder } from "../ReferencesBuilder";
import { traverseSugar } from "../Traversing/TraverseSugar";

import { UserDefinedTypeUsagesInfoType } from "./UserDefinedTypeUsagesInfo";
import { UserDefinedTypeUsagesVisitor } from "./UserDefinedTypeUsagesVisitor";

export class UserDefinedTypeUsagesBuilder extends ReferencesBuilder {
    private readonly sugarElementInfos: SugarElementInfo[];

    public constructor(sugarElementInfos: SugarElementInfo[]) {
        super();
        this.sugarElementInfos = sugarElementInfos;
    }

    public buildUsages(
        userDefinedTypes: UserDefinedSugarTypeInfo[],
        projectContext: ISugarProjectContext
    ): UserDefinedTypeUsagesInfoType {
        const visitor = new UserDefinedTypeUsagesVisitor(userDefinedTypes, this.sugarElementInfos);
        for (const projectFilePath of projectContext.getAllProjectFilePaths()) {
            visitor.currentlyTraversingFilePath = projectFilePath;
            traverseSugar(projectContext.getSugarDomByFilePath(projectFilePath), visitor);
        }

        return visitor.getUsages();
    }

    public findReferences(context: CodeContext, usagesGroups: UserDefinedTypeUsagesInfoType): Location[] {
        const typeElement = this.findNearestElementByName(context.contextNode, "type");
        const typeName = this.getValueAttributeByName(typeElement, "name");
        if (typeName != undefined && usagesGroups != undefined) {
            const usages = usagesGroups.find(x => x.source.name === typeName);
            if (usages != undefined) {
                return this.mapUsages(usages.usages);
            }
        }
        return [];
    }
}
