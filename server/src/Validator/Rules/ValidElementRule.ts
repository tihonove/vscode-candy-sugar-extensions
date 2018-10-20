import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { SugarElementName } from "../../SugarParsing/SugarGrammar/SugarParser";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";

export class ValidElementRule extends SugarValidatorRuleBase {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];

    public constructor(elementInfos: SugarElementInfo[]) {
        super("valid-element");
        this.elementInfos = elementInfos;
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
