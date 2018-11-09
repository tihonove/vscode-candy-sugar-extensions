import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { SugarElementName } from "../../SugarParsing/SugarGrammar/SugarParser";
import { ISugarProjectContext } from "../Validator/ISugarProjectContext";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";

export class ValidElementRule extends SugarValidatorRuleBase {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];

    public constructor(context: ISugarProjectContext) {
        super("valid-element");
        this.elementInfos = context.getSugarElementInfos();
    }

    public visitElementName(elementName: SugarElementName): void {
        if (this.elementInfos.find(x => x.name === elementName.value) === undefined) {
            this.validations.push({
                position: elementName.position,
                message: `Неизвестное имя элемента: '${elementName.value}'`,
            });
        }
    }

    public getValidations(): ValidationItem[] {
        return this.validations;
    }
}
