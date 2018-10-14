import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const minLength: SugarElementInfo = {
    name: "minLength",
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
