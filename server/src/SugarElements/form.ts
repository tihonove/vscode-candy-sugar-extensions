import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../Suggester/SugarElementInfo";

export const form: SugarElementInfo = {
    name: "form",
    attributes: [
        { name: "maxunitscount", valueTypes: [AttributeType.Number] },
        { name: "templates", valueTypes: [AttributeType.Boolean] },
        { name: "navigationLimit", valueTypes: [AttributeType.Number] },
        { name: "xmlns:uf", valueTypes: [AttributeType.String], optional: true },
        { name: "xmlns:m", valueTypes: [AttributeType.String] },
    ],
    availableChildren: { type: AvailableChildrenType.Any },
};
