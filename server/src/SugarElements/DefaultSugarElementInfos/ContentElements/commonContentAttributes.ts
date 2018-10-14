import { AttributeType, SugarAttributeInfo } from "../../SugarElementInfo";

export const commonContentAttributes: SugarAttributeInfo[] = [
    { name: "caption", valueTypes: [AttributeType.String], optional: true },
    { name: "gId", valueTypes: [AttributeType.PicklistId], optional: true },
];
