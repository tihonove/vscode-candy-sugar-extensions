import { ISugarDomVisitor } from "../../../SugarAnalyzing/Traversing/ISugarDomVisitor";

import { ValidationItem } from "./ValidationItem";

export interface ISugarValidatorRule extends ISugarDomVisitor {
    readonly name: string;
    getValidations(): ValidationItem[];
}
