import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidAttributeRule } from "../../../../server/src/Validator/Rules/ValidAttributeRule";
import { testSugarElementInfos } from "../../Utils/TestInfos";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class ValidAttributeRuleTest extends SugarValidationRuleTestBase {
    protected createRule(): ISugarValidatorRule {
        return new ValidAttributeRule(testSugarElementInfos);
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
}
