import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const hr: SugarElementInfo = {
    name: "hr",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        { name: "kind", valueTypes: [AttributeType.Enum] },
        { name: "width", valueTypes: [AttributeType.Enum] },
        visibilityPathAttribute,
    ],
};
