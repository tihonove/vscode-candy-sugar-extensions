import { constant, Decoder, optional } from "@mojotech/json-type-validation";

import { TypeInfoExtractor } from "../../SugarAnalyzing/TypeInfoExtraction/TypeInfoExtractor";
import { UserDefinedTypeUsagesBuilder } from "../../SugarAnalyzing/UserDefinedTypeUsagesAnalizing/UserDefinedTypeUsagesBuilder";
import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { ISugarProjectContext } from "../Validator/ISugarProjectContext";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";

export class NoUnusedTypesRule extends SugarValidatorRuleBase {
    private readonly sugarElementInfos: SugarElementInfo[];
    private readonly context: ISugarProjectContext;
    private readonly validations: ValidationItem[] = [];

    public constructor(context: ISugarProjectContext) {
        super("no-unused-types");
        this.context = context;
        this.sugarElementInfos = context.getSugarElementInfos();
    }

    protected getDefaultSettings(): undefined {
        return;
    }

    protected createDecoder(): Decoder<undefined> {
        return optional(constant(undefined));
    }

    public beforeProcess(sugarDocument: SugarElement): void {
        const typeInfoExtractor = new TypeInfoExtractor();
        const userDefinedTypes = typeInfoExtractor.extractTypeInfos(sugarDocument);
        const userDefinedTypeUsagesBuilder = new UserDefinedTypeUsagesBuilder(this.sugarElementInfos);
        const usages = userDefinedTypeUsagesBuilder.buildUsages(userDefinedTypes, this.context);
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
