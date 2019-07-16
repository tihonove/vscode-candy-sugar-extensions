import { constant, Decoder, optional } from "@mojotech/json-type-validation";

import { TemplatesExtractor } from "../../SugarAnalyzing/TemplatesExtraction/TemplatesExtractor";
import { UserDefinedTemplateUsagesBuilder } from "../../SugarAnalyzing/UserDefinedTemplateUsagesAnalizing/UserDefinedTemplateUsagesBuilder";
import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { ISugarProjectContext } from "../Validator/ISugarProjectContext";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";

export class NoUnusedTemplateRule extends SugarValidatorRuleBase {
    private readonly sugarElementInfos: SugarElementInfo[];
    private readonly context: ISugarProjectContext;
    private readonly validations: ValidationItem[] = [];

    public constructor(context: ISugarProjectContext) {
        super("no-unused-templates");
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
        const templateInfoExtractor = new TemplatesExtractor();
        const userDefinedTemplates = templateInfoExtractor.extractTemplates(sugarDocument);
        const userDefinedTypeUsagesBuilder = new UserDefinedTemplateUsagesBuilder(this.sugarElementInfos);
        const usages = userDefinedTypeUsagesBuilder.buildTemplateUsages(userDefinedTemplates, this.context);
        this.validations.push(
            ...usages.filter(x => x.usages.length === 0).map(x => ({
                position: x.source.position,
                message: `Шаблон '${x.source.name}' не используется`,
            }))
        );
    }
    public getValidations(): ValidationItem[] {
        return this.validations;
    }
}
