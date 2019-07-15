import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const email: SugarElementInfo = {
    name: "email",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "caption", valueTypes: [AttributeType.String] }],
};
