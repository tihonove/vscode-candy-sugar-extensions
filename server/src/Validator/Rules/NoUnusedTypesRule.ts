import { UserDefinedTypeUsagesBuilder } from "../../SugarAnalyzing/UserDefinedTypeUsagesAnalizing/UserDefinedTypeUsagesBuilder";
import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";

export class NoUnusedTypesRule extends SugarValidatorRuleBase {
    public userDefinedTypes: UserDefinedSugarTypeInfo[];
    public sugarElementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];

    public constructor(userDefinedTypes: UserDefinedSugarTypeInfo[], sugarElementInfos: SugarElementInfo[]) {
        super("no-unused-types");
        this.userDefinedTypes = userDefinedTypes;
        this.sugarElementInfos = sugarElementInfos;
    }

    public beforeProcess(sugarDocument: SugarElement): void {
        const userDefinedTypeUsagesBuilder = new UserDefinedTypeUsagesBuilder(this.sugarElementInfos);
        const usages = userDefinedTypeUsagesBuilder.buildUsages(this.userDefinedTypes, sugarDocument);
        this.validations.push(
            ...usages.filter(x => x.usages.length === 0).map(x => ({
                position: x.type.position,
                message: `Тип '${x.type.name}' не используется`,
            }))
        );
    }
    public getValidations(): ValidationItem[] {
        return this.validations;
    }
}
