import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const icon: SugarElementInfo = {
    name: "icon",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        {
            name: "name",
            valueTypes: [AttributeType.String],
        },
    ],
};
