import { AttributeTypes, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const period: SugarElementInfo = {
    name: "period",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        { name: "caption", valueTypes: [AttributeTypes.String] },
        { name: "gId", valueTypes: [AttributeTypes.PicklistId] },
    ],
};
