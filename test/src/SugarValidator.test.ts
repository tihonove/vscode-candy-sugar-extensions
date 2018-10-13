import { suite, test } from "mocha-typescript";

import { ValidAttributeRule } from "../../server/src/Validator/Rules/ValidAttributeRule";
import { ValidElementRule } from "../../server/src/Validator/Rules/ValidElementRule";
import { SugarValidator } from "../../server/src/Validator/Validator/SugarValidator";

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

    @test
    public invalidAttributeRule(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new ValidAttributeRule(testSugarElementInfos));

        expect(validator.validate(`<atag1 invalidAttr="123"/>`)).to.shallowDeepEqual([
            {
                position: {
                    start: { offset: 7 },
                    end: { offset: 24 },
                },
                message: `Элемент atag1 не может имееть атрибута 'invalidAttr'`,
            },
        ]);
    }

    @test
    public syntaxError(): void {
        const validator = new SugarValidator();
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
