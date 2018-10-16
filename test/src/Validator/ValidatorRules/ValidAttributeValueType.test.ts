import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidAttributeValueType } from "../../../../server/src/Validator/Rules/ValidAttributeValueType";
import { testSugarElementInfos } from "../../Utils/TestInfos";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class ValidAttributeValueTypeTest extends SugarValidationRuleTestBase {
    protected createRule(): ISugarValidatorRule {
        return new ValidAttributeValueType(testSugarElementInfos);
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
