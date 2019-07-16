import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidAttributeRule } from "../../../../server/src/Validator/Rules/ValidAttributeRule";
import { ValidatorSettings } from "../../../../server/src/Validator/Settings/ValidatorSettings";
import { ISugarProjectContext } from "../../../../server/src/Validator/Validator/ISugarProjectContext";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class ValidAttributeRuleTest extends SugarValidationRuleTestBase {
    protected createRule(context: ISugarProjectContext): ISugarValidatorRule {
        return new ValidAttributeRule(context);
    }

    protected getDefaultValidatorSettings(): ValidatorSettings {
        return {
            "valid-attribute": ["error"],
        };
    }

    @test
    public invalidAttributeRule(): void {
        this.assertInvalidCode(`<atag1 invalidAttr="123"/>`, {
            position: {
                start: { offset: 7 },
                end: { offset: 24 },
            },
            message: `Элемент atag1 не может имееть атрибута 'invalidAttr'`,
        });
    }

    @test
    public reusedAttributeRule(): void {
        this.assertInvalidCode(`<atag1 path path />`, {
            position: {
                start: { offset: 7 },
                end: { offset: 11 },
            },
            message: `Элемент atag1 уже использует атрибут 'path'`,
        });
    }
}
