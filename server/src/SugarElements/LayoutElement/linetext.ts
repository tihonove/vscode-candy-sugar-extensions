// Layout
import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import {
    invisibilityPathAttribute,
    invisibilityPathValuettribute,
    visibilityPathAttribute,
    visibilityPathValueAttribute
} from "../Commons/visibilityPathAttribute";

export const linetext: SugarElementInfo = {
    name: "linetext",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        visibilityPathAttribute,
        visibilityPathValueAttribute,
        invisibilityPathAttribute,
        invisibilityPathValuettribute,
        { name: "width", valueTypes: [AttributeType.Number] },
        { name: "textalign", valueTypes: [AttributeType.Enum], optional: true },
        { name: "align", valueTypes: [AttributeType.Enum], optional: true },
        { name: "marginTop", valueTypes: [AttributeType.Number], optional: true },
        { name: "size", valueTypes: [AttributeType.Number], optional: true },
        { name: "color", valueTypes: [AttributeType.Color], optional: true },
    ],
};
