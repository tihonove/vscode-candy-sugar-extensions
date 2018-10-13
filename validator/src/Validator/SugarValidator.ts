import { NullTracer } from "../../../server/src/PegJSUtils/NullTracer";
import { parseSugar, SugarElement } from "../../../server/src/SugarCodeDomBuilder/SugarGrammar/SugarParser";
import { ISugarValidatorRule } from "../Rules/Bases/ISugarValidatorRule";

import { traverseSugar } from "./TraverseSugar";
import { ValidationItem } from "./ValidationItem";

export class SugarValidator {
    private readonly rules: SugarValidatorRuleFactory[] = [];

    public validate(input: string): ValidationItem[] {
        const parseResult = parseSugar(input, { tracer: new NullTracer() });
        const validations: ValidationItem[] = [];
        for (const ruleFactory of this.rules) {
            const rule = ruleFactory();
            validations.push(...this.processRule(rule, parseResult));
        }
        return validations;
    }

    public addRule(rule: SugarValidatorRuleFactory): void {
        this.rules.push(rule);
    }

    private processRule(rule: ISugarValidatorRule, sugarRoot: SugarElement): ValidationItem[] {
        traverseSugar(sugarRoot, rule);
        return rule.getValidations();
    }
}

export type SugarValidatorRuleFactory = () => ISugarValidatorRule;
