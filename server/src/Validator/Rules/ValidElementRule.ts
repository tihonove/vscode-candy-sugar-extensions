import { SugarElementName } from "../../SugarCodeDomBuilder/SugarGrammar/SugarParser";
import { SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { ISugarValidatorRule } from "./Bases/ISugarValidatorRule";
import { ValidationItem } from "./Bases/ValidationItem";

export class ValidElementRule implements ISugarValidatorRule {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];
    public readonly name: string;

    public constructor(elementInfos: SugarElementInfo[]) {
        this.elementInfos = elementInfos;
        this.name = "valid-element";
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
