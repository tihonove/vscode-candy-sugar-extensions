import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const fractionDigits: SugarElementInfo = {
    name: "fractionDigits",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        {
            name: "value",
            valueTypes: [AttributeType.Number],
        },
    ],
};
