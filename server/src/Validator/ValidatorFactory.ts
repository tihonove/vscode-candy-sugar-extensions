import { allElements } from "../SugarElements/DefaultSugarElements";

import { ValidElementRule } from "./Rules/ValidElementRule";
import { SugarValidator } from "./Validator/SugarValidator";

export function createDefaultValidator(): SugarValidator {
    const sugarValidator = new SugarValidator();
    sugarValidator.addRule(() => new ValidElementRule(allElements));
    return sugarValidator;
}
