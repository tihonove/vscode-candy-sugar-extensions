import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const column: SugarElementInfo = {
    name: "column",
    attributes: [
        {
            name: "width",
            valueTypes: [AttributeType.Number],
            optional: true,
        },
        {
            name: "colspan",
            valueTypes: [AttributeType.Number],
            optional: true,
        },
    ],
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
};
