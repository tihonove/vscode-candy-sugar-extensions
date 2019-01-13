import { ISugarDomVisitor } from "../../../SugarAnalyzing/Traversing/ISugarDomVisitor";
import { SugarElement } from "../../../SugarParsing/SugarGrammar/SugarParser";

import { ValidationItem } from "./ValidationItem";

export interface ISugarValidatorRule extends ISugarDomVisitor {
    readonly name: string;
    setRuleSettings(settings: unknown): void;
    getValidations(): ValidationItem[];
    beforeProcess(sugarDocument: SugarElement, input: string): void;
}
