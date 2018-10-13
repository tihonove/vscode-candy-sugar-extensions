import { ISugarDomVisitor } from "../../Validator/TraverseSugar";
import { ValidationItem } from "../../Validator/ValidationItem";

export interface ISugarValidatorRule extends ISugarDomVisitor {
    getValidations(): ValidationItem[];
}
