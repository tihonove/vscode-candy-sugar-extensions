import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

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
