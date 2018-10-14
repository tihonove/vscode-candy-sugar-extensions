import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const infoorg: SugarElementInfo = {
    name: "infoorg",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "include", valueTypes: [AttributeType.Enum] }],
};
