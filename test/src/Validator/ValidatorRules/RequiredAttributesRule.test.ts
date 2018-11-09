import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { RequiredAttributesRule } from "../../../../server/src/Validator/Rules/RequiredAttributesRule";
import { ISugarProjectContext } from "../../../../server/src/Validator/Validator/ISugarProjectContext";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class RequiredAttributesRuleTest extends SugarValidationRuleTestBase {
    protected createRule(context: ISugarProjectContext): ISugarValidatorRule {
        return new RequiredAttributesRule(context);
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
