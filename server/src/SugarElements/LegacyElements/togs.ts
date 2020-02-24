import { AttributeTypes, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const togs: SugarElementInfo = {
    name: "togs",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        { name: "caption", valueTypes: [AttributeTypes.String] },
        { name: "gId", valueTypes: [AttributeTypes.PicklistId] },
    ],
};
