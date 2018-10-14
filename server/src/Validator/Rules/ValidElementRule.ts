import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { SugarElementName } from "../../SugarParsing/SugarGrammar/SugarParser";
import { EmptySugarDomVisitor } from "../Validator/TraverseSugar";

import { ValidationItem } from "./Bases/ValidationItem";

export class ValidElementRule extends EmptySugarDomVisitor {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];
    public readonly name: string;

    public constructor(elementInfos: SugarElementInfo[]) {
        super();
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
