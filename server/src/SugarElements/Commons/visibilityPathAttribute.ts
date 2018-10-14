import { AttributeType, SugarAttributeInfo } from "../../Suggester/SugarElementInfo";

export const visibilityPathAttribute: SugarAttributeInfo = {
    name: "visibilityPath",
    valueTypes: [AttributeType.VisibilityPath],
    optional: true,
};

export const invisibilityPathAttribute: SugarAttributeInfo = {
    name: "invisibilityPath",
    valueTypes: [AttributeType.VisibilityPath],
    optional: true,
};

export const visibilityPathValueAttribute: SugarAttributeInfo = {
    name: "visibilityPathValue",
    valueTypes: [AttributeType.Boolean],
    optional: true,
};

export const invisibilityPathValuettribute: SugarAttributeInfo = {
    name: "invisibilityPathValue",
    valueTypes: [AttributeType.Boolean],
    optional: true,
};
