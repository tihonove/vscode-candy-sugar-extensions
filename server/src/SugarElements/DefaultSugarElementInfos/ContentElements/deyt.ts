import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const deyt: SugarElementInfo = {
    name: "deyt",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "caption", valueTypes: [AttributeType.String] }],
};
