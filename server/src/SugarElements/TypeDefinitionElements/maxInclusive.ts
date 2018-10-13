import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const maxInclusive: SugarElementInfo = {
    name: "maxInclusive",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        {
            name: "value",
            valueTypes: [AttributeType.Number],
        },
    ],
};
