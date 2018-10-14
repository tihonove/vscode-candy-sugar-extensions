import { suite, test } from "mocha-typescript";

import { RequiredAttributesRule } from "../../server/src/Validator/Rules/RequiredAttributesRule";
import { ValidAttributeRule } from "../../server/src/Validator/Rules/ValidAttributeRule";
import { ValidAttributeValueType } from "../../server/src/Validator/Rules/ValidAttributeValueType";
import { ValidElementRule } from "../../server/src/Validator/Rules/ValidElementRule";
import { ValidPathRule } from "../../server/src/Validator/Rules/ValidPathRule";
import { SugarValidator } from "../../server/src/Validator/Validator/SugarValidator";

import { expect } from "./Utils/Expect";
import { testDataSchema, testSugarElementInfos } from "./Utils/TestInfos";

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
    public validPathRule(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new ValidPathRule(testDataSchema, testSugarElementInfos));
        expect(validator.validate(`<atag1 path="Root"/>`)).to.eql([]);
    }

    @test
    public inValidPathRule(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new ValidPathRule(testDataSchema, testSugarElementInfos));
        expect(validator.validate(`<atag1 path="InvalidPath"/>`)).to.shallowDeepEqual([
            {
                position: {
                    start: { offset: 12 },
                    end: { offset: 25 },
                },
                message: `Элемент или атрибут 'InvalidPath' не найден в схеме данных`,
            },
        ]);
    }

    @test
    public requiredAttributesRule(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new RequiredAttributesRule(testSugarElementInfos));
        expect(validator.validate(`<atag1 />`)).to.shallowDeepEqual([
            {
                position: {
                    start: { offset: 0 },
                    end: { offset: 9 },
                },
                message: "Элемент atag1 должен содержать обязательный атрибут 'required-attr'",
            },
        ]);
    }

    @test
    public attributeValueTypeRule(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new ValidAttributeValueType(testSugarElementInfos));
        expect(validator.validate(`<atag1 number-attr="aaa1" />`)).to.shallowDeepEqual([
            {
                position: {
                    start: { offset: 19 },
                    end: { offset: 25 },
                },
                message: "Значение атрибута 'aaa1' не может быть преобразовано к допустимым типам (boolean).",
            },
        ]);
    }

    @test
    public invalidPathWithScopedElement(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new ValidPathRule(testDataSchema, testSugarElementInfos));
        expect(validator.validate(`<atag1 path="Root"><atag1 path="Root"/></atag1>`)).to.shallowDeepEqual([
            {
                position: {
                    start: { offset: 31 },
                    end: { offset: 37 },
                },
                message: `Элемент или атрибут 'Root/Root' не найден в схеме данных`,
            },
        ]);
    }

    @test
    public absolutePathWithScopedElement(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new ValidPathRule(testDataSchema, testSugarElementInfos));
        expect(validator.validate(`<atag1 path="Root"><atag1 path="/Root"/></atag1>`)).to.eql([]);
    }

    @test
    public absolutePathWithScopedElementWithRoot(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new ValidPathRule(testDataSchema, testSugarElementInfos));
        expect(validator.validate(`<atag1 path="/Root/Children1"><btag2 path="Child1"/></atag1>`)).to.eql([]);
    }

    @test
    public absolutePathWithScopedElementWithRoot_CaseTwo(): void {
        const validator = new SugarValidator();
        validator.addRule(() => new ValidPathRule(testDataSchema, testSugarElementInfos));
        expect(validator.validate(`<atag1 path="/Root"><atag><atag1 path="Children1/Child1"/></atag1></atag>`)).to.eql(
            []
        );
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
