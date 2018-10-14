import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";
import {
    invisibilityPathAttribute,
    invisibilityPathValuettribute,
    visibilityPathAttribute,
    visibilityPathValueAttribute,
} from "../Commons/visibilityPathAttribute";

export const item: SugarElementInfo = {
    name: "item",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        visibilityPathAttribute,
        invisibilityPathAttribute,
        visibilityPathValueAttribute,
        invisibilityPathValuettribute,
        { name: "label", valueTypes: [AttributeType.String] },
        { name: "width", valueTypes: [AttributeType.Number] },
        { name: "indent", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "alignLabel", valueTypes: [AttributeType.Enum], optional: true },
        { name: "noPaddings", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
