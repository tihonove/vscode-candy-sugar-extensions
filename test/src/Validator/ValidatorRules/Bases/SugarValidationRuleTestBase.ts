import { expect } from "chai";

import { CodeLocation } from "../../../../../server/src/Utils/PegJSUtils/Types";
import { ISugarValidatorRule } from "../../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ISugarProjectContext } from "../../../../../server/src/Validator/Validator/ISugarProjectContext";
import { SugarValidator } from "../../../../../server/src/Validator/Validator/SugarValidator";
import { TestProjectContext } from "../../../TestProjectContext";

export class SugarValidationRuleTestBase {
    protected assertValidCode(input: string): void {
        const validator = new SugarValidator(new TestProjectContext({ "index.sugar.xml": input }));
        validator.addRule((context: ISugarProjectContext) => this.createRule(context));

        expect(validator.validate(input)).to.eql([]);
    }

    protected assertInvalidCode(input: string, ...errors: ValidationReportItemAssert[]): void {
        const validator = new SugarValidator(new TestProjectContext({ "index.sugar.xml": input }));
        validator.addRule((context: ISugarProjectContext) => this.createRule(context));

        if (errors.length === 0) {
            expect(validator.validate(input).length).to.be.greaterThan(0);
        }
        expect(validator.validate(input)).to.shallowDeepEqual(errors);
    }

    protected createRule(_context: ISugarProjectContext): ISugarValidatorRule {
        throw new Error("Необходимо определить метод createRule для запуска тестов на правило валидации");
    }
}

export interface ValidationReportItemAssert {
    position?: {
        start?: Partial<CodeLocation>;
        end?: Partial<CodeLocation>;
    };
    message?: string;
}
