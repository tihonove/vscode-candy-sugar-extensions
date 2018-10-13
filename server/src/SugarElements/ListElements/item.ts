import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const item: SugarElementInfo = {
    name: "item",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        visibilityPathAttribute,
        { name: "label", valueTypes: [AttributeType.String] },
        { name: "width", valueTypes: [AttributeType.Number] },
    ],
};
