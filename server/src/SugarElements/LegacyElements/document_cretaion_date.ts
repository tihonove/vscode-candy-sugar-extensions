import { AttributeTypes, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const document_cretaion_date: SugarElementInfo = {
    name: "document_cretaion_date",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        { name: "caption", valueTypes: [AttributeTypes.String], required: false },
        { name: "gId", valueTypes: [AttributeTypes.PicklistId], required: false },
    ],
};
