import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const pattern: SugarElementInfo = {
    name: "pattern",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        {
            name: "value",
            valueTypes: [AttributeType.String],
        },
    ],
};
