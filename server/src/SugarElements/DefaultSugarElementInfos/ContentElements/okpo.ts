import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const okpo: SugarElementInfo = {
    name: "okpo",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "caption", valueTypes: [AttributeType.String] }],
};
