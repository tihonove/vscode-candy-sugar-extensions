import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const responsible_post: SugarElementInfo = {
    name: "responsible_post",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "caption", valueTypes: [AttributeType.String] }],
};
