import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const mail: SugarElementInfo = {
    name: "mail",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "caption", valueTypes: [AttributeType.String] }],
};
