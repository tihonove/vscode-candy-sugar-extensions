import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { ISugarProjectContext } from "../Validator/ISugarProjectContext";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";
import { constant, Decoder, optional } from "@mojotech/json-type-validation";

export class RequiredAttributesRule extends SugarValidatorRuleBase {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];
    private readonly checkOnlyElementNames: string[];

    public constructor(context: ISugarProjectContext) {
        super("required-attribute");
        this.elementInfos = context.getSugarElementInfos();
        this.checkOnlyElementNames = ["form", "input", "atag1"];
    }

    protected getDefaultSettings(): undefined {
        return;
    }

    protected createDecoder(): Decoder<undefined> {
        return optional(constant(undefined));
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
