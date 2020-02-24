import { AttributeTypes, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const name: SugarElementInfo = {
    name: "name",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        { name: "caption", valueTypes: [AttributeTypes.String] },
        { name: "editable", valueTypes: [AttributeTypes.Boolean], required: false },
    ],
};
