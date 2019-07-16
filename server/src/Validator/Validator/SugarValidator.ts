import { traverseSugar } from "../../SugarAnalyzing/Traversing/TraverseSugar";
import { parseSugar, SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { NullTracer } from "../../Utils/PegJSUtils/NullTracer";
import { ISugarValidatorRule } from "../Rules/Bases/ISugarValidatorRule";
import { ValidationItem } from "../Rules/Bases/ValidationItem";
import { ValidatorSettings } from "../Settings/ValidatorSettings";

import { ISugarProjectContext } from "./ISugarProjectContext";

enum ValidationSeverity {
    Error = "Error",
}

export interface ValidationReportItem extends ValidationItem {
    severity: ValidationSeverity;
    ruleName: string;
}

export class InvalidRuleOptionsError extends Error {
    public constructor(message: string) {
        super(message);
    }
}

export class SugarValidator {
    private readonly rules: SugarValidatorRuleFactory[] = [];
    private readonly context: ISugarProjectContext;

    public constructor(context: ISugarProjectContext) {
        this.context = context;
    }

    public validate(input: string, settings: ValidatorSettings): ValidationReportItem[] {
        try {
            const parseResult = parseSugar(input, { tracer: new NullTracer() });
            const validations: ValidationReportItem[] = [];
            for (const ruleFactory of this.rules) {
                const rule = ruleFactory(this.context);
                if (!this.isRuleEnabled(settings, rule)) {
                    continue;
                }
                try {
                    rule.setRuleSettings(settings[rule.name][1]);
                } catch (ruleError) {
                    if (ruleError instanceof Error) {
                        throw new InvalidRuleOptionsError(ruleError.message);
                    }
                    throw new InvalidRuleOptionsError(`${ruleError}`);
                }
                rule.beforeProcess(parseResult, input);
                validations.push(...this.processRule(rule, parseResult));
            }
            return validations;
        } catch (e) {
            if (e instanceof InvalidRuleOptionsError) {
                throw e;
            }
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

    private isRuleEnabled(settings: ValidatorSettings, rule: ISugarValidatorRule): boolean {
        return settings[rule.name] != undefined && settings[rule.name][0] !== "off";
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

export type SugarValidatorRuleFactory = (context: ISugarProjectContext) => ISugarValidatorRule;
