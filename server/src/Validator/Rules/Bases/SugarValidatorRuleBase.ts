import { EmptySugarDomVisitor } from "../../../SugarAnalyzing/Traversing/EmptySugarDomVisitor";
import { SugarElement } from "../../../SugarParsing/SugarGrammar/SugarParser";

import { ISugarValidatorRule } from "./ISugarValidatorRule";
import { ValidationItem } from "./ValidationItem";

export class SugarValidatorRuleBase extends EmptySugarDomVisitor implements ISugarValidatorRule {
    public readonly name: string;

    public constructor(name: string) {
        super();
        this.name = name;
    }

    public beforeProcess(_sugarDocument: SugarElement, _input: string): void {
        // empty impl
    }

    public getValidations(): ValidationItem[] {
        return [];
    }
}
