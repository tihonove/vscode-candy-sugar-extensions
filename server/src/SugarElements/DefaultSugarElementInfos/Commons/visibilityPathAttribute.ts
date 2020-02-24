import { AttributeTypes, SugarAttributeInfo } from "../../SugarElementInfo";

export const visibilityPathAttribute: SugarAttributeInfo = {
    name: "visibilityPath",
    valueTypes: [AttributeTypes.VisibilityPath],
    required: false,
};

export const invisibilityPathAttribute: SugarAttributeInfo = {
    name: "invisibilityPath",
    valueTypes: [AttributeTypes.VisibilityPath],
    required: false,
};

export const visibilityPathValueAttribute: SugarAttributeInfo = {
    name: "visibilityPathValue",
    valueTypes: [AttributeTypes.Boolean],
    required: false,
};

export const invisibilityPathValuettribute: SugarAttributeInfo = {
    name: "invisibilityPathValue",
    valueTypes: [AttributeTypes.Boolean],
    required: false,
};
