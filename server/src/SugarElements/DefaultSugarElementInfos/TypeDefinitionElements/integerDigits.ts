import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const integerDigits: SugarElementInfo = {
    name: "integerDigits",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [{ name: "value", valueTypes: [AttributeType.Number] }],
};
