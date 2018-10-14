import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const totalDigits: SugarElementInfo = {
    name: "totalDigits",
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
