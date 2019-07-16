import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidTypeRule } from "../../../../server/src/Validator/Rules/ValidTypeRule";
import { ValidatorSettings } from "../../../../server/src/Validator/Settings/ValidatorSettings";
import { ISugarProjectContext } from "../../../../server/src/Validator/Validator/ISugarProjectContext";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class ValidRuleTypeTest extends SugarValidationRuleTestBase {
    protected createRule(context: ISugarProjectContext): ISugarValidatorRule {
        return new ValidTypeRule(context);
    }

    protected getDefaultValidatorSettings(): ValidatorSettings {
        return {
            "valid-type": ["error"],
        };
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
        this.assertValidCode(
            `<form><types><type name="a-type1" base="string" /></types><atag1 type="a-type1"/></form>`
        );
    }

    @test
    public validBuiltInType(): void {
        this.assertValidCode(`<atag1 type="string"/>`);
    }
}
