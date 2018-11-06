import { suite, test } from "mocha-typescript";

import { ValidElementRule } from "../../../server/src/Validator/Rules/ValidElementRule";
import { SugarValidator } from "../../../server/src/Validator/Validator/SugarValidator";
import { expect } from "../Utils/Expect";
import { testSugarElementInfos } from "../Utils/TestInfos";

@suite
export class SugarValidatorTest {
    @test
    public testSyntaxError(): void {
        const validator = new SugarValidator(undefined);
        validator.addRule(() => new ValidElementRule(testSugarElementInfos));

        expect(validator.validate("<not ")).to.shallowDeepEqual([
            {
                position: {
                    start: { offset: 5 },
                    end: { offset: 5 },
                },
                message: 'Expected "/>", ">", [ \\r\\n\\t], or [a-zA-Z0-9\\-:_] but end of input found.',
                ruleName: "valid-syntax",
            },
        ]);
    }
}
