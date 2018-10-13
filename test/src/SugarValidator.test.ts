import { suite, test } from "mocha-typescript";

import { ValidElementRule } from "../../validator/src/Rules/ValidElementRule";
import { SugarValidator } from "../../validator/src/Validator/SugarValidator";

import { expect } from "./Utils/Expect";
import { testSugarElementInfos } from "./Utils/TestInfos";

@suite
export class SugarValidatorTest {
    @test
    public validElementTest(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new ValidElementRule(testSugarElementInfos));

        expect(validator.validate("<atag1 />")).to.eql([]);
    }

    @test
    public invalidElementTest(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new ValidElementRule(testSugarElementInfos));

        expect(validator.validate("<not-existing-tag />")).to.shallowDeepEqual([
            {
                position: {
                    start: { offset: 1 },
                    end: { offset: 17 },
                },
                message: `Неизвестное имя элемента: 'not-existing-tag'`,
            },
        ]);
    }
}
