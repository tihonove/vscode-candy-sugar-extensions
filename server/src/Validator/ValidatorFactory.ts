import { allElements } from "../SugarElements/DefaultSugarElements";

import { ValidElementRule } from "./Rules/ValidElementRule";
import { SugarValidator } from "./Validator/SugarValidator";
import { ValidAttributeRule } from "./Rules/ValidAttributeRule";

export function createDefaultValidator(): SugarValidator {
    const sugarValidator = new SugarValidator();
    sugarValidator.addRule(() => new ValidElementRule(allElements));
    sugarValidator.addRule(() => new ValidAttributeRule(allElements));
    return sugarValidator;
}
