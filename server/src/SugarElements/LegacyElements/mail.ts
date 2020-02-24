import { AttributeTypes, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const mail: SugarElementInfo = {
    name: "mail",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "caption", valueTypes: [AttributeTypes.String] }],
};
