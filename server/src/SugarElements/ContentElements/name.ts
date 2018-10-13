import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const name: SugarElementInfo = {
    name: "name",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [{ name: "caption", valueTypes: [AttributeType.String] }],
};
