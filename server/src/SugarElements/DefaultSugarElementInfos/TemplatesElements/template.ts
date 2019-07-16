import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const template: SugarElementInfo = {
    name: "template",
    attributes: [{ name: "name", valueTypes: [AttributeType.String] }],
    availableChildren: {
        type: AvailableChildrenType.List,
        list: ["params", "body"],
    },
};
