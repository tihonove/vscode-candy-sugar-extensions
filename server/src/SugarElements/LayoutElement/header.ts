import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const header: SugarElementInfo = {
    name: "header",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [{ name: "align", valueTypes: [AttributeType.Enum], optional: true }],
};
