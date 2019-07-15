import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const phone: SugarElementInfo = {
    name: "phone",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [{ name: "caption", valueTypes: [AttributeType.String] }],
};
