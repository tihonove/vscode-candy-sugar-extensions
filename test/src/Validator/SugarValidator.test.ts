import { suite, test } from "mocha-typescript";

import { ValidElementRule } from "../../../server/src/Validator/Rules/ValidElementRule";
import { ValidatorSettings } from "../../../server/src/Validator/Settings/ValidatorSettings";
import { SugarValidator } from "../../../server/src/Validator/Validator/SugarValidator";
import { TestProjectContext } from "../TestProjectContext";
import { expect } from "../Utils/Expect";

@suite
export class SugarValidatorTest {
    @test
    public testSyntaxError(): void {
        const validator = new SugarValidator(new TestProjectContext({}));
        validator.addRule(context => new ValidElementRule(context));

        expect(validator.validate("<not ", {})).to.shallowDeepEqual([
            {
                position: {
                    start: { offset: 5 },
                    end: { offset: 5 },
                },
                message: 'Expected "/>", ">", [ \\r\\n\\t], or [a-zа-я0-9\\-:_] but end of input found.',
                ruleName: "valid-syntax",
            },
        ]);
    }

    @test
    public testInvalidClosingTag(): void {
        const validator = new SugarValidator(new TestProjectContext({}));

        expect(validator.validate("<b><a>" + "<zzz></zzz>" + "</b>", {})).to.shallowDeepEqual([
            {
                message: "Expecting </a>, but </b> found",
                position: {
                    end: {
                        column: 21,
                        line: 1,
                        offset: 20,
                    },
                    start: {
                        column: 20,
                        line: 1,
                        offset: 19,
                    },
                },
                ruleName: "valid-syntax",
                severity: "Error",
            },
        ]);
    }

    @test
    public testSettings(): void {
        const validator = new SugarValidator(new TestProjectContext({}));
        validator.addRule(context => new ValidElementRule(context));

        const settings: ValidatorSettings = {
            "valid-element": ["off"],
        };

        expect(validator.validate("<zzz></zzz>", settings)).to.shallowDeepEqual([]);
    }
}
