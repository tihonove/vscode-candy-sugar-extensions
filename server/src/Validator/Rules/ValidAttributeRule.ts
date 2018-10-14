import { SugarAttributeName } from "../../SugarCodeDomBuilder/SugarGrammar/SugarParser";
import { SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { EmptySugarDomVisitor } from "../Validator/TraverseSugar";

import { ValidationItem } from "./Bases/ValidationItem";

export class ValidAttributeRule extends EmptySugarDomVisitor {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];
    public readonly name: string;

    public constructor(elementInfos: SugarElementInfo[]) {
        super();
        this.elementInfos = elementInfos;
        this.name = "valid-attribute";
    }

    public visitAttributeName(attributeName: SugarAttributeName): void {
        const attribute = attributeName.parent;
        const element = attribute.parent;
        const elementInfo = this.elementInfos.find(x => x.name === element.name.value);
        if (elementInfo == undefined) {
            return;
        }
        // if (elementInfo.attributes == undefined) {
        //     // TODO Временно, пока нет определений для других файлов
        //     return;
        // }
        const attributeInfo = (elementInfo.attributes || []).find(x => x.name === attributeName.value);
        if (attributeInfo == undefined) {
            this.validations.push({
                position: attribute.position,
                message: `Элемент ${element.name.value} не может имееть атрибута '${attributeName.value}'`,
            });
        }
    }

    public getValidations(): ValidationItem[] {
        return this.validations;
    }
}
