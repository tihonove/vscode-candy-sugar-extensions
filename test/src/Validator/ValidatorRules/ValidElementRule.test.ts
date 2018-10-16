import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidElementRule } from "../../../../server/src/Validator/Rules/ValidElementRule";
import { testSugarElementInfos } from "../../Utils/TestInfos";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class ValidElementRuleTest extends SugarValidationRuleTestBase {
    protected createRule(): ISugarValidatorRule {
        return new ValidElementRule(testSugarElementInfos);
    }

    @test
    public validElementTest(): void {
        this.assertValidCode("<atag1 />");
    }

    @test
    public invalidElementTest(): void {
        this.assertInvalidCode("<not-existing-tag />", {
            position: {
                start: { offset: 1 },
                end: { offset: 17 },
            },
            message: `Неизвестное имя элемента: 'not-existing-tag'`,
        });
    }
}
