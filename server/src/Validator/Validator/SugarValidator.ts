import { parseSugar, SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { NullTracer } from "../../Utils/PegJSUtils/NullTracer";
import { ISugarValidatorRule } from "../Rules/Bases/ISugarValidatorRule";
import { ValidationItem } from "../Rules/Bases/ValidationItem";

import { DataSchemaElementNode } from "../../DataSchema/DataSchemaNode";
import { traverseSugar } from "../../SugarAnalyzing/Traversing/TraverseSugar";
import { TypeInfoExtractor } from "../../SugarAnalyzing/TypeInfoExtraction/TypeInfoExtractor";
import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";

enum ValidationSeverity {
    Error = "Error",
}

export interface ValidationReportItem extends ValidationItem {
    severity: ValidationSeverity;
    ruleName: string;
}

export class SugarValidator {
    private readonly rules: SugarValidatorRuleFactory[] = [];
    private readonly typeInfoExtractor: TypeInfoExtractor;
    private dataSchema: undefined | DataSchemaElementNode;

    public constructor(dataSchema: undefined | DataSchemaElementNode) {
        this.dataSchema = dataSchema;
        this.typeInfoExtractor = new TypeInfoExtractor();
    }

    public updateDataSchema(dataSchema: undefined | DataSchemaElementNode): void {
        this.dataSchema = dataSchema;
    }

    public validate(input: string): ValidationReportItem[] {
        try {
            const parseResult = parseSugar(input, { tracer: new NullTracer() });
            const userDefinedTypeInfos = this.typeInfoExtractor.extractTypeInfos(parseResult);
            const validations: ValidationReportItem[] = [];
            for (const ruleFactory of this.rules) {
                const rule = ruleFactory(userDefinedTypeInfos, this.dataSchema);
                rule.beforeProcess(parseResult);
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

export type SugarValidatorRuleFactory = (
    userDefinedTypeInfos: UserDefinedSugarTypeInfo[],
    dataSchema: undefined | DataSchemaElementNode
) => ISugarValidatorRule;
