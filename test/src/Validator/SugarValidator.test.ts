import { suite, test } from "mocha-typescript";

import { ValidElementRule } from "../../../server/src/Validator/Rules/ValidElementRule";
import { SugarValidator } from "../../../server/src/Validator/Validator/SugarValidator";
import { TestProjectContext } from "../TestProjectContext";
import { expect } from "../Utils/Expect";

@suite
export class SugarValidatorTest {
    @test
    public testSyntaxError(): void {
        const validator = new SugarValidator(new TestProjectContext({}));
        validator.addRule(context => new ValidElementRule(context));

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
