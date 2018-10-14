import { AttributeType, SugarAttributeInfo } from "../../SugarElementInfo";

export const fetchFnAttribute: SugarAttributeInfo = {
    name: "fetchfn",
    valueTypes: [AttributeType.FunctionName],
    optional: true,
};
