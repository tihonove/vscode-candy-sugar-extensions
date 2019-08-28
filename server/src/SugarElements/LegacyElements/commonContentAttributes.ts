import { AttributeType, SugarAttributeInfo } from "../SugarElementInfo";

export const commonContentAttributes: SugarAttributeInfo[] = [
    { name: "caption", valueTypes: [AttributeType.String], required: false },
    { name: "gId", valueTypes: [AttributeType.PicklistId], required: false },
];
