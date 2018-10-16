import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { RequiredAttributesRule } from "../../../../server/src/Validator/Rules/RequiredAttributesRule";
import { testSugarElementInfos } from "../../Utils/TestInfos";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class RequiredAttributesRuleTest extends SugarValidationRuleTestBase {
    protected createRule(): ISugarValidatorRule {
        return new RequiredAttributesRule(testSugarElementInfos);
    }

    @test
    public requiredAttributesRule(): void {
        this.assertInvalidCode(`<atag1 />`, {
            position: {
                start: { offset: 0 },
                end: { offset: 9 },
            },
            message: "Элемент atag1 должен содержать обязательный атрибут 'required-attr'",
        });
    }
}
