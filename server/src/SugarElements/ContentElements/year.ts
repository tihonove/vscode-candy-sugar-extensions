import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const year: SugarElementInfo = {
    name: "year",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [{ name: "caption", valueTypes: [AttributeType.String] }],
};
