import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const sign: SugarElementInfo = {
    name: "sign",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "include", valueTypes: [AttributeType.Enum] }],
};
