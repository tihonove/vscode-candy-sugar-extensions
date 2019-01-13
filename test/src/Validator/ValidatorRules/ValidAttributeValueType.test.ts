import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidAttributeValueType } from "../../../../server/src/Validator/Rules/ValidAttributeValueType";
import { ISugarProjectContext } from "../../../../server/src/Validator/Validator/ISugarProjectContext";
import { ValidatorSettings } from "../../../../server/src/Validator/Settings/ValidatorSettings";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class ValidAttributeValueTypeTest extends SugarValidationRuleTestBase {
    protected createRule(context: ISugarProjectContext): ISugarValidatorRule {
        return new ValidAttributeValueType(context);
    }

    protected getDefaultValidatorSettings(): ValidatorSettings {
        return {
            "valid-attribute-type": ["error"],
        };
    }

    @test
    public attributeValueTypeRule(): void {
        this.assertInvalidCode(`<atag1 number-attr="aaa1" />`, {
            position: {
                start: { offset: 19 },
                end: { offset: 25 },
            },
            message: "Значение 'aaa1' атрибута number-attr не может быть преобразовано к допустимым типам (boolean).",
        });
    }
}
