import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidCodeStyleRule } from "../../../../server/src/Validator/Rules/ValidCodeStyleRule";
import { ISugarProjectContext } from "../../../../server/src/Validator/Validator/ISugarProjectContext";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class ValidCodeStyleRuleTest extends SugarValidationRuleTestBase {
    protected createRule(context: ISugarProjectContext): ISugarValidatorRule {
        return new ValidCodeStyleRule(context);
    }

    @test
    public validCodeStyleTest(): void {
        this.assertValidCode("<atag1 />\n");
    }

    @test
    public invalidCodeStyleTest(): void {
        this.assertInvalidCode("<atag1></atag1>", {
            position: {
                end: {
                    column: 1,
                    line: 1,
                    offset: 15,
                },
                start: {
                    column: 7,
                    line: 1,
                    offset: 6,
                },
            },
            message: "Replace '></atag1>' with '·/>⏎'",
        });
    }
}
