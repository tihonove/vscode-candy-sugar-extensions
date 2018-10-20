import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";

export class RequiredAttributesRule extends SugarValidatorRuleBase {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];
    private readonly checkOnlyElementNames: string[];

    public constructor(elementInfos: SugarElementInfo[]) {
        super("required-attribute");
        this.elementInfos = elementInfos;
        this.checkOnlyElementNames = ["form", "input", "atag1"];
    }

    public visitElement(element: SugarElement): void {
        const attributeNames = (element.attributes || []).map(x => x.name.value);
        const elementInfo = this.elementInfos.find(x => x.name === element.name.value);
        if (elementInfo == undefined || elementInfo.attributes == undefined || elementInfo.attributes.length === 0) {
            return;
        }
        if (!this.checkOnlyElementNames.includes(elementInfo.name)) {
            return;
        }
        const attributeInfos = elementInfo.attributes;
        for (const attributeInfo of attributeInfos) {
            if (!attributeInfo.optional && !attributeNames.includes(attributeInfo.name)) {
                this.validations.push({
                    position: element.position,
                    message: `Элемент ${element.name.value} должен содержать обязательный атрибут '${
                        attributeInfo.name
                    }'`,
                });
            }
        }
    }

    public getValidations(): ValidationItem[] {
        return this.validations;
    }
}
