import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidTypeRule } from "../../../../server/src/Validator/Rules/ValidTypeRule";
import { testSugarElementInfos, testSugarTypes } from "../../Utils/TestInfos";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class ValidAttributeRuleTest extends SugarValidationRuleTestBase {
    protected createRule(): ISugarValidatorRule {
        return new ValidTypeRule(testSugarTypes, testSugarElementInfos);
    }

    @test
    public invalidAttributeRule(): void {
        this.assertInvalidCode(`<atag1 type="no-existing-type"/>`, {
            position: {
                start: { offset: 12 },
                end: { offset: 30 },
            },
            message: "Тип 'no-existing-type' не существует",
        });
    }

    @test
    public validCode(): void {
        this.assertValidCode(`<atag1 type="a-type1"/>`);
    }

    @test
    public validBuiltInType(): void {
        this.assertValidCode(`<atag1 type="string"/>`);
    }
}
