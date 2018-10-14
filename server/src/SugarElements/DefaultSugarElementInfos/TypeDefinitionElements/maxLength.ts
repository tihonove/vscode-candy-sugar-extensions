import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const maxLength: SugarElementInfo = {
    name: "maxLength",
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
