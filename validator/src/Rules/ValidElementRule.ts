import { SugarElementName } from "../../../server/src/SugarCodeDomBuilder/SugarGrammar/SugarParser";
import { SugarElementInfo } from "../../../server/src/Suggester/SugarElementInfo";
import { ValidationItem } from "../Validator/ValidationItem";

import { ISugarValidatorRule } from "./Bases/ISugarValidatorRule";

export class ValidElementRule implements ISugarValidatorRule {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];

    public constructor(elementInfos: SugarElementInfo[]) {
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
