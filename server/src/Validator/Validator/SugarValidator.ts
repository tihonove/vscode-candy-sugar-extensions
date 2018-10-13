import { NullTracer } from "../../PegJSUtils/NullTracer";
import { parseSugar, SugarElement } from "../../SugarCodeDomBuilder/SugarGrammar/SugarParser";
import { ISugarValidatorRule } from "../Rules/Bases/ISugarValidatorRule";
import { ValidationItem } from "../Rules/Bases/ValidationItem";

import { traverseSugar } from "./TraverseSugar";

enum ValidationSeverity {
    Error = "Error",
}

export interface ValidationReportItem extends ValidationItem {
    severity: ValidationSeverity;
    ruleName: string;
}

export class SugarValidator {
    private readonly rules: SugarValidatorRuleFactory[] = [];

    public validate(input: string): ValidationReportItem[] {
        try {
            const parseResult = parseSugar(input, { tracer: new NullTracer() });
            const validations: ValidationReportItem[] = [];
            for (const ruleFactory of this.rules) {
                const rule = ruleFactory();
                validations.push(...this.processRule(rule, parseResult));
            }
            return validations;
        } catch (e) {
            return [
                {
                    ruleName: "valid-syntax",
                    // tslint:disable-next-line no-unsafe-any
                    position: e.location,
                    // tslint:disable-next-line no-unsafe-any
                    message: e.message,
                    severity: ValidationSeverity.Error,
                },
            ];
        }
    }

    public addRule(rule: SugarValidatorRuleFactory): void {
        this.rules.push(rule);
    }

    private processRule(rule: ISugarValidatorRule, sugarRoot: SugarElement): ValidationReportItem[] {
        traverseSugar(sugarRoot, rule);
        return rule.getValidations().map(x => ({
            ...x,
            severity: ValidationSeverity.Error,
            ruleName: rule.name,
        }));
    }
}

export type SugarValidatorRuleFactory = () => ISugarValidatorRule;