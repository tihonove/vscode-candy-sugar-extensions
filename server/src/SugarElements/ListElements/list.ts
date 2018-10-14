import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { pathAttribute } from "../Commons/pathAttribute";
import {
    invisibilityPathAttribute,
    invisibilityPathValuettribute,
    visibilityPathAttribute,
    visibilityPathValueAttribute,
} from "../Commons/visibilityPathAttribute";

export const list: SugarElementInfo = {
    name: "list",
    availableChildren: {
        type: AvailableChildrenType.List,
        list: ["item"],
    },
    attributes: [
        pathAttribute,
        visibilityPathAttribute,
        visibilityPathValueAttribute,
        invisibilityPathAttribute,
        invisibilityPathValuettribute,
        { name: "width", valueTypes: [AttributeType.Number] },
        { name: "inline", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "bullet", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
