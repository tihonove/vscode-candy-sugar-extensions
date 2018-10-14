import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const when: SugarElementInfo = {
    name: "when",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "test", valueTypes: [AttributeType.String] }],
};
