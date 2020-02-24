import { AttributeTypes, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const infoorg: SugarElementInfo = {
    name: "infoorg",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "include", valueTypes: [AttributeTypes.String] }],
};
