import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const period: SugarElementInfo = {
    name: "period",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        { name: "caption", valueTypes: [AttributeType.String] },
        { name: "gId", valueTypes: [AttributeType.PicklistId] },
    ],
};
