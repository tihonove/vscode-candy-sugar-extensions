import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidElementRule } from "../../../../server/src/Validator/Rules/ValidElementRule";
import { ValidatorSettings } from "../../../../server/src/Validator/Settings/ValidatorSettings";
import { ISugarProjectContext } from "../../../../server/src/Validator/Validator/ISugarProjectContext";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class ValidElementRuleTest extends SugarValidationRuleTestBase {
    protected createRule(context: ISugarProjectContext): ISugarValidatorRule {
        return new ValidElementRule(context);
    }

    protected getDefaultValidatorSettings(): ValidatorSettings {
        return {
            "valid-element": ["error"],
        };
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
