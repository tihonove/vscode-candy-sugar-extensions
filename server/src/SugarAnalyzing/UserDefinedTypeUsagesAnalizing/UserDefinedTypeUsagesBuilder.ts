import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { ISugarProjectContext } from "../../Validator/Validator/ISugarProjectContext";
import { traverseSugar } from "../Traversing/TraverseSugar";

import { UserDefinedTypeUsagesInfo } from "./UserDefinedTypeUsagesInfo";
import { UserDefinedTypeUsagesVisitor } from "./UserDefinedTypeUsagesVisitor";

export class UserDefinedTypeUsagesBuilder {
    private readonly sugarElementInfos: SugarElementInfo[];

    public constructor(sugarElementInfos: SugarElementInfo[]) {
        this.sugarElementInfos = sugarElementInfos;
    }

    public buildUsages(
        userDefinedTypes: UserDefinedSugarTypeInfo[],
        projectContext: ISugarProjectContext
    ): UserDefinedTypeUsagesInfo[] {
        const visitor = new UserDefinedTypeUsagesVisitor(userDefinedTypes, this.sugarElementInfos);
        for (const projectFilePath of projectContext.getAllProjectFilePaths()) {
            visitor.currentlyTraversingFilePath = projectFilePath;
            traverseSugar(projectContext.getSugarDomByFilePath(projectFilePath), visitor);
        }

        return visitor.getUsages();
    }
}
