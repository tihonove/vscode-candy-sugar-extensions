import { suite, test } from "mocha-typescript";

import { UserDefinedSugarTypeInfo } from "../../../../server/src/SugarElements/UserDefinedSugarTypeInfo";
import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { NoUnusedTypesRule } from "../../../../server/src/Validator/Rules/NoUnusedTypesRule";
import { testSugarElementInfos } from "../../Utils/TestInfos";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class NoUnusedTypesRuleTest extends SugarValidationRuleTestBase {
    protected createRule(userDefinedTypes: UserDefinedSugarTypeInfo[]): ISugarValidatorRule {
        return new NoUnusedTypesRule(userDefinedTypes, testSugarElementInfos);
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
