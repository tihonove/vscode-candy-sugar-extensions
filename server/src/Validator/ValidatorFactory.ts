import { DataSchemaElementNode } from "../DataSchema/DataSchemaNode";
import { allElements } from "../SugarElements/DefaultSugarElementInfos/DefaultSugarElements";

import { NoUnusedTypesRule } from "./Rules/NoUnusedTypesRule";
import { RequiredAttributesRule } from "./Rules/RequiredAttributesRule";
import { ValidAttributeRule } from "./Rules/ValidAttributeRule";
import { ValidAttributeValueType } from "./Rules/ValidAttributeValueType";
import { ValidElementRule } from "./Rules/ValidElementRule";
import { ValidPathRule } from "./Rules/ValidPathRule";
import { ValidTypeRule } from "./Rules/ValidTypeRule";
import { SugarValidator } from "./Validator/SugarValidator";

export function createDefaultValidator(dataSchema: undefined | DataSchemaElementNode): SugarValidator {
    const sugarValidator = new SugarValidator(dataSchema);
    sugarValidator.addRule(() => new ValidElementRule(allElements));
    sugarValidator.addRule(() => new ValidAttributeRule(allElements));
    sugarValidator.addRule(() => new RequiredAttributesRule(allElements));
    sugarValidator.addRule(() => new ValidAttributeValueType(allElements));
    sugarValidator.addRule(userDefinedTypes => new ValidTypeRule(userDefinedTypes, allElements));
    sugarValidator.addRule(userDefinedTypes => new NoUnusedTypesRule(userDefinedTypes, allElements));
    sugarValidator.addRule((_x, dataSchema) => new ValidPathRule(dataSchema, allElements));
    return sugarValidator;
}
