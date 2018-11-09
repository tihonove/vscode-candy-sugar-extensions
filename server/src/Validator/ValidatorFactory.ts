import { NoUnusedTypesRule } from "./Rules/NoUnusedTypesRule";
import { RequiredAttributesRule } from "./Rules/RequiredAttributesRule";
import { ValidAttributeRule } from "./Rules/ValidAttributeRule";
import { ValidAttributeValueType } from "./Rules/ValidAttributeValueType";
import { ValidElementRule } from "./Rules/ValidElementRule";
import { ValidPathRule } from "./Rules/ValidPathRule";
import { ValidTypeRule } from "./Rules/ValidTypeRule";
import { ISugarProjectContext } from "./Validator/ISugarProjectContext";
import { SugarValidator } from "./Validator/SugarValidator";

export function createDefaultValidator(context: ISugarProjectContext): SugarValidator {
    const sugarValidator = new SugarValidator(context);
    sugarValidator.addRule((context: ISugarProjectContext) => new ValidElementRule(context));
    sugarValidator.addRule((context: ISugarProjectContext) => new ValidAttributeRule(context));
    sugarValidator.addRule((context: ISugarProjectContext) => new RequiredAttributesRule(context));
    sugarValidator.addRule((context: ISugarProjectContext) => new ValidAttributeValueType(context));
    sugarValidator.addRule((context: ISugarProjectContext) => new ValidTypeRule(context));
    sugarValidator.addRule((context: ISugarProjectContext) => new NoUnusedTypesRule(context));
    sugarValidator.addRule((context: ISugarProjectContext) => new ValidPathRule(context));
    return sugarValidator;
}
