import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const minInclusive: SugarElementInfo = {
    name: "minInclusive",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        {
            name: "value",
            valueTypes: [AttributeType.Number],
        },
    ],
};
