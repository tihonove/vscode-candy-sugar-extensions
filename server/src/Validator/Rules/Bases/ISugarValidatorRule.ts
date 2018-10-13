import { ISugarDomVisitor } from "../../Validator/TraverseSugar";

import { ValidationItem } from "./ValidationItem";

export interface ISugarValidatorRule extends ISugarDomVisitor {
    readonly name: string;
    getValidations(): ValidationItem[];
}
