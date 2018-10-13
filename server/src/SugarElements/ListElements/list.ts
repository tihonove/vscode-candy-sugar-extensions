import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const list: SugarElementInfo = {
    name: "list",
    availableChildren: {
        type: AvailableChildrenType.List,
        list: ["item"],
    },
    attributes: [
        { name: "width", valueTypes: [AttributeType.Number] },
        { name: "inline", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
