import { ISugarDomVisitor } from "../../../SugarAnalyzing/Traversing/ISugarDomVisitor";
import { SugarElement } from "../../../SugarParsing/SugarGrammar/SugarParser";

import { ValidationItem } from "./ValidationItem";

export interface ISugarValidatorRule extends ISugarDomVisitor {
    readonly name: string;
    getValidations(): ValidationItem[];
    beforeProcess(sugarDocument: SugarElement): void;
}
