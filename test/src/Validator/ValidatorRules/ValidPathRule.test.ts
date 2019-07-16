import { suite, test } from "mocha-typescript";

import { ISugarValidatorRule } from "../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidPathRule } from "../../../../server/src/Validator/Rules/ValidPathRule";
import { ValidatorSettings } from "../../../../server/src/Validator/Settings/ValidatorSettings";
import { ISugarProjectContext } from "../../../../server/src/Validator/Validator/ISugarProjectContext";

import { SugarValidationRuleTestBase } from "./Bases/SugarValidationRuleTestBase";

@suite
export class ValidPathRuleTest extends SugarValidationRuleTestBase {
    protected createRule(context: ISugarProjectContext): ISugarValidatorRule {
        return new ValidPathRule(context);
    }

    protected getDefaultValidatorSettings(): ValidatorSettings {
        return {
            "valid-path": ["error"],
        };
    }

    @test
    public validPathRule(): void {
        this.assertValidCode(`<atag1 path="Root"/>`);
    }

    @test
    public validPathRuleWithComplexPath(): void {
        this.assertValidCode(`<atag1 path="Root/Children1"/>`);
    }

    @test
    public validPathRuleWithNesting(): void {
        this.assertValidCode(`<atag1 path="Root"><atag1 path="Children1"/></atag1>`);
    }

    @test
    public inValidPathRule(): void {
        this.assertInvalidCode(`<atag1 path="InvalidPath"/>`, {
            position: {
                start: { offset: 12 },
                end: { offset: 25 },
            },
            message: `Элемент или атрибут 'InvalidPath' не найден в схеме данных`,
        });
    }

    @test
    public invalidPathWithScopedElement(): void {
        this.assertInvalidCode(`<atag1 path="Root"><atag1 path="Root"/></atag1>`, {
            position: {
                start: { offset: 31 },
                end: { offset: 37 },
            },
            message: `Элемент или атрибут 'Root/Root' не найден в схеме данных`,
        });
    }

    @test
    public absolutePathWithScopedElement(): void {
        this.assertValidCode(`<atag1 path="Root"><atag1 path="/Root"/></atag1>`);
    }

    @test
    public absolutePathWithScopedElementWithRoot(): void {
        this.assertValidCode(`<atag1 path="/Root/Children1"><btag2 path="Child1"/></atag1>`);
    }

    @test
    public absolutePathWithScopedElementWithRoot_CaseTwo(): void {
        this.assertValidCode(`<atag1 path="/Root"><atag><atag1 path="Children1/Child1"/></atag></atag1>`);
    }
}
