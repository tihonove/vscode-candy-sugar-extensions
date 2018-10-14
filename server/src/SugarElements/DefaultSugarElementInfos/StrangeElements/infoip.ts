import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const infoip: SugarElementInfo = {
    name: "infoip",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "include", valueTypes: [AttributeType.Enum] }],
};
