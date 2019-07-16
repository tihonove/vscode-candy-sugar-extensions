import { constant, Decoder, optional } from "@mojotech/json-type-validation";

import { SugarElementDefinedType, SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { SugarAttribute } from "../../SugarParsing/SugarGrammar/SugarParser";
import { ISugarProjectContext } from "../Validator/ISugarProjectContext";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";

export class ValidTemplateName extends SugarValidatorRuleBase {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];

    public constructor(context: ISugarProjectContext) {
        super("valid-template-name");
        this.elementInfos = context.getSugarElementInfos();
    }

    protected getDefaultSettings(): undefined {
        return;
    }

    protected createDecoder(): Decoder<undefined> {
        return optional(constant(undefined));
    }

    public visitAttribute(attribute: SugarAttribute): void {
        if (!attribute.value || attribute.parent.name.value !== "template") {
            return;
        }

        const definedTemplates = this.elementInfos
            .filter(x => x.definedType === SugarElementDefinedType.Template)
            .filter(x => attribute.value && x.name === attribute.value.value);

        if (definedTemplates.length > 1) {
            this.validations.push({
                position: attribute.value != undefined ? attribute.value.position : attribute.name.position,
                message: `Шаблон с именем '${attribute.value.value}' уже существует`,
            });
        }
    }

    public getValidations(): ValidationItem[] {
        return this.validations;
    }
}
