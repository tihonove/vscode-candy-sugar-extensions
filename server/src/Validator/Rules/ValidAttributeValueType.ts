import { AttributeTypeUtils } from "../../SugarElements/AttributeTypeUtils";
import { AttributeType, SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { SugarAttribute } from "../../SugarParsing/SugarGrammar/SugarParser";
import { ISugarProjectContext } from "../Validator/ISugarProjectContext";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";

export class ValidAttributeValueType extends SugarValidatorRuleBase {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];

    public constructor(context: ISugarProjectContext) {
        super("valid-attribute-type");
        this.elementInfos = context.getSugarElementInfos();
    }

    public visitAttribute(attribute: SugarAttribute): void {
        const attributeName = attribute.name;
        const element = attribute.parent;
        const elementInfo = this.elementInfos.find(x => x.name === element.name.value);
        if (elementInfo == undefined) {
            return;
        }
        const attributeInfo = (elementInfo.attributes || []).find(x => x.name === attributeName.value);
        if (attributeInfo == undefined) {
            return;
        }
        const attributeValue = attribute.value ? attribute.value.value : undefined;
        if (attributeInfo.valueTypes.every(x => !this.isValueMatchToType(attributeValue, x))) {
            this.validations.push({
                position: attribute.value != undefined ? attribute.value.position : attribute.name.position,
                message:
                    `Значение '${attributeValue === undefined ? "<empty>" : attributeValue}' атрибута ${
                        attributeInfo.name
                    } ` +
                    `не может быть преобразовано к допустимым типам ` +
                    `(${attributeInfo.valueTypes.map(x => AttributeTypeUtils.valueTypeToString(x)).join(", ")}).`,
            });
        }
    }

    public getValidations(): ValidationItem[] {
        return this.validations;
    }

    private isValueMatchToType(attributeValue: string | undefined, attributeType: AttributeType): boolean {
        if (attributeType === AttributeType.Number) {
            if (attributeValue === undefined) {
                return false;
            }
            return /^[+\-]?\d*\.?\d+(?:[Ee][+\-]?\d+)?$/.test(attributeValue);
        }
        if (attributeType === AttributeType.Color) {
            if (attributeValue === undefined) {
                return false;
            }
            return /^#([\da-f]{3})|([\da-f]{6)$/i.test(attributeValue);
        }
        if (attributeType === AttributeType.Boolean) {
            if (attributeValue === undefined) {
                return false;
            }
            return /^(true|false)$/.test(attributeValue);
        }
        return true;
    }
}
