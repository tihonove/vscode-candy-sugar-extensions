import { AttributeType, SugarAttributeInfo } from "../../Suggester/SugarElementInfo";

export const fetchFnAttribute: SugarAttributeInfo = {
    name: "fetchfn",
    valueTypes: [AttributeType.FunctionName],
    optional: true,
};
