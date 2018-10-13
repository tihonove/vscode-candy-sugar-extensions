import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const togs: SugarElementInfo = {
    name: "togs",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        { name: "caption", valueTypes: [AttributeType.String] },
        { name: "gId", valueTypes: [AttributeType.PicklistId] },
    ],
};
