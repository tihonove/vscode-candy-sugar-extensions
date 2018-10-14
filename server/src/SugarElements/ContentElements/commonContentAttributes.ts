import { AttributeType, SugarAttributeInfo } from "../../Suggester/SugarElementInfo";

export const commonContentAttributes: SugarAttributeInfo[] = [
    { name: "caption", valueTypes: [AttributeType.String], optional: true },
    { name: "gId", valueTypes: [AttributeType.PicklistId], optional: true },
];
