import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const attachments: SugarElementInfo = {
    name: "attachments",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        { name: "maxSize", valueTypes: [AttributeType.Number] },
        { name: "extentions", valueTypes: [AttributeType.JavaScriptLiteral] },
        { name: "count", valueTypes: [AttributeType.Number] },
        { name: "totalSize", valueTypes: [AttributeType.Number] },
        { name: "countExceededDescription", valueTypes: [AttributeType.String] },
    ],
};
