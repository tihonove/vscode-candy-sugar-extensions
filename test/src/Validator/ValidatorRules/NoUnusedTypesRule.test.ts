import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { NoUnusedTypesRule } from "../../../../server/src/Validator/Rules/NoUnusedTypesRule";
import { ValidatorSettings } from "../../../../server/src/Validator/Settings/ValidatorSettings";
import { ISugarProjectContext } from "../../../../server/src/Validator/Validator/ISugarProjectContext";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class NoUnusedTypesRuleTest extends SugarValidationRuleTestBase {
    protected createRule(context: ISugarProjectContext): ISugarValidatorRule {
        return new NoUnusedTypesRule(context);
    }

    protected getDefaultValidatorSettings(): ValidatorSettings {
        return {
            "no-unused-types": ["error"],
        };
    }

    @test
    public invalidAttributeRule(): void {
        this.assertInvalidCode(
            `<form>
                <types>
                    <type name="type-1" base="string"></type>
                </types>
                <page>                
                </page>
            </form>`,
            {
                position: {
                    start: { offset: 51 },
                    end: { offset: 92 },
                },
                message: "Тип 'type-1' не используется",
            }
        );
    }

    @test
    public validCode(): void {
        this.assertValidCode(`
            <form>
                <types>
                    <type name="type-1" base="string"></type>
                </types>
                <page>
                    <atag1 path="Root" type="type-1" />                
                </page>
            </form>`);
    }
}
