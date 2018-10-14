import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const length: SugarElementInfo = {
    name: "length",
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
