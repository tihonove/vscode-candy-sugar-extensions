import { constant, Decoder, optional } from "@mojotech/json-type-validation";

import { AttributeTypeKind, SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { defaultBuiltInTypeNames, UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarAttribute } from "../../SugarParsing/SugarGrammar/SugarParser";
import { ISugarProjectContext } from "../Validator/ISugarProjectContext";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";

export class ValidTypeRule extends SugarValidatorRuleBase {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];
    private readonly userDefinedTypes: UserDefinedSugarTypeInfo[];

    public constructor(context: ISugarProjectContext) {
        super("valid-type");
        this.userDefinedTypes = context.getAllUserDefinedTypes();
        this.elementInfos = context.getSugarElementInfos();
    }

    protected getDefaultSettings(): undefined {
        return;
    }

    protected createDecoder(): Decoder<undefined> {
        return optional(constant(undefined));
    }

    public visitAttribute(attribute: SugarAttribute): void {
        const attributeName = attribute.name;
        const element = attribute.parent;
        const elementInfo = this.elementInfos.find(x => x.name === element.name.value);
        if (attribute.value == undefined) {
            return;
        }
        if (elementInfo == undefined) {
            return;
        }
        const attributeInfo = (elementInfo.attributes || []).find(x => x.name === attributeName.value);
        if (attributeInfo == undefined) {
            return;
        }
        if (attributeInfo.valueTypes.length === 1 && attributeInfo.valueTypes[0].type === AttributeTypeKind.Type) {
            const typeName = attribute.value.value;
            if (typeof typeName === "string" && !this.isTypeExists(typeName)) {
                this.validations.push({
                    position: attribute.value.position,
                    message: `Тип '${typeName}' не существует`,
                });
            }
        }
    }

    public getValidations(): ValidationItem[] {
        return this.validations;
    }

    private isTypeExists(typeName: string): boolean {
        return this.userDefinedTypes.some(x => x.name === typeName) || defaultBuiltInTypeNames.includes(typeName);
    }
}
