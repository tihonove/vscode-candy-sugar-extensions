import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const enumeration: SugarElementInfo = {
    name: "enumeration",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        { name: "value", valueTypes: [AttributeType.String] },
        { name: "name", valueTypes: [AttributeType.String], optional: true },
        { name: "hint", valueTypes: [AttributeType.String], optional: true },
    ],
};
