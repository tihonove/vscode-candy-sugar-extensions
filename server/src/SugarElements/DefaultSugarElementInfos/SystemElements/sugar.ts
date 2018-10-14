import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const sugar: SugarElementInfo = {
    name: "sugar",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        { name: "include", valueTypes: [AttributeType.String] },
        { name: "path", valueTypes: [AttributeType.String] },
    ],
};
