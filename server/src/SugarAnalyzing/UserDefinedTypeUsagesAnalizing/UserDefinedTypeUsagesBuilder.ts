import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
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
        sugarDom: SugarElement
    ): UserDefinedTypeUsagesInfo[] {
        const visitor = new UserDefinedTypeUsagesVisitor(userDefinedTypes, this.sugarElementInfos);
        traverseSugar(sugarDom, visitor);
        return visitor.getUsages();
    }
}
