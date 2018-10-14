import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const document_cretaion_date: SugarElementInfo = {
    name: "document_cretaion_date",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        { name: "caption", valueTypes: [AttributeType.String], optional: true },
        { name: "gId", valueTypes: [AttributeType.PicklistId], optional: true },
    ],
};
