import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const radio: SugarElementInfo = {
    name: "radio",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        {
            name: "value",
            valueTypes: [AttributeType.String],
        },
        {
            name: "name",
            valueTypes: [AttributeType.String],
        },
    ],
};
