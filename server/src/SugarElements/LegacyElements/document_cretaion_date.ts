import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const document_cretaion_date: SugarElementInfo = {
    name: "document_cretaion_date",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        { name: "caption", valueTypes: [AttributeType.String], required: false },
        { name: "gId", valueTypes: [AttributeType.PicklistId], required: false },
    ],
};
