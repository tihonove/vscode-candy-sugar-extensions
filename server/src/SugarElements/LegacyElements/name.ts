import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const name: SugarElementInfo = {
    name: "name",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        { name: "caption", valueTypes: [AttributeType.String] },
        { name: "editable", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
