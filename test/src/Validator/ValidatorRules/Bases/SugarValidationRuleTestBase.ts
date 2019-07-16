import { expect } from "chai";

import { CodeLocation } from "../../../../../server/src/Utils/PegJSUtils/Types";
import { ISugarValidatorRule } from "../../../../../server/src/Validator/Rules/Bases/ISugarValidatorRule";
import { ValidatorSettings } from "../../../../../server/src/Validator/Settings/ValidatorSettings";
import { ISugarProjectContext } from "../../../../../server/src/Validator/Validator/ISugarProjectContext";
import { SugarValidator } from "../../../../../server/src/Validator/Validator/SugarValidator";
import { TestProjectContext } from "../../../TestProjectContext";

export class SugarValidationRuleTestBase {
    protected assertValidCode(input: string, settings?: ValidatorSettings): void {
        const validator = new SugarValidator(new TestProjectContext({ "index.sugar.xml": input }));
        validator.addRule((context: ISugarProjectContext) => this.createRule(context));

        expect(validator.validate(input, this.getActualSettings(settings))).to.eql([]);
    }

    protected getDefaultValidatorSettings(): ValidatorSettings {
        throw new Error("AbstractError");
    }

    protected assertInvalidCode(input: string, ...errors: ValidationReportItemAssert[]): void {
        const validator = new SugarValidator(new TestProjectContext({ "index.sugar.xml": input }));
        validator.addRule((context: ISugarProjectContext) => this.createRule(context));

        if (errors.length === 0) {
            expect(validator.validate(input, this.getActualSettings(undefined)).length).to.be.greaterThan(0);
        }
        expect(validator.validate(input, this.getActualSettings(undefined))).to.shallowDeepEqual(errors);
    }

    protected createRule(_context: ISugarProjectContext): ISugarValidatorRule {
        throw new Error("Необходимо определить метод createRule для запуска тестов на правило валидации");
    }

    private getActualSettings(settings: undefined | ValidatorSettings): ValidatorSettings {
        if (settings == undefined) {
            return this.getDefaultValidatorSettings();
        }
        return settings;
    }
}

export interface ValidationReportItemAssert {
    position?: {
        start?: Partial<CodeLocation>;
        end?: Partial<CodeLocation>;
    };
    message?: string;
}
