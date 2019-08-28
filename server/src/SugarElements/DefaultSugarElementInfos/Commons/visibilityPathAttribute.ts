import { AttributeType, SugarAttributeInfo } from "../../SugarElementInfo";

export const visibilityPathAttribute: SugarAttributeInfo = {
    name: "visibilityPath",
    valueTypes: [AttributeType.VisibilityPath],
    required: false,
};

export const invisibilityPathAttribute: SugarAttributeInfo = {
    name: "invisibilityPath",
    valueTypes: [AttributeType.VisibilityPath],
    required: false,
};

export const visibilityPathValueAttribute: SugarAttributeInfo = {
    name: "visibilityPathValue",
    valueTypes: [AttributeType.Boolean],
    required: false,
};

export const invisibilityPathValuettribute: SugarAttributeInfo = {
    name: "invisibilityPathValue",
    valueTypes: [AttributeType.Boolean],
    required: false,
};
