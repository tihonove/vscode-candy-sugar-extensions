import { AttributeTypes, SugarAttributeInfo } from "../SugarElementInfo";

export const commonContentAttributes: SugarAttributeInfo[] = [
    { name: "caption", valueTypes: [AttributeTypes.String], required: false },
    { name: "gId", valueTypes: [AttributeTypes.PicklistId], required: false },
];
