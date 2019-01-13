export type RuleSeverityFlag = "off" | "error" | "warn";

export type RuleSettings = unknown;

export interface ValidatorSettings {
    [ruleName: string]: [RuleSeverityFlag] | [RuleSeverityFlag, RuleSettings];
}
