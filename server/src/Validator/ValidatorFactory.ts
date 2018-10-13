import { DataSchemaElementNode } from "../DataSchema/DataSchemaNode";
import { allElements } from "../SugarElements/DefaultSugarElements";

import { ValidAttributeRule } from "./Rules/ValidAttributeRule";
import { ValidElementRule } from "./Rules/ValidElementRule";
import { ValidPathRule } from "./Rules/ValidPathRule";
import { SugarValidator } from "./Validator/SugarValidator";

export function createDefaultValidator(dataSchema: undefined | DataSchemaElementNode): SugarValidator {
    const sugarValidator = new SugarValidator();
    sugarValidator.addRule(() => new ValidElementRule(allElements));
    sugarValidator.addRule(() => new ValidAttributeRule(allElements));
    if (dataSchema != undefined) {
        sugarValidator.addRule(() => new ValidPathRule(dataSchema, allElements));
    }
    return sugarValidator;
}
