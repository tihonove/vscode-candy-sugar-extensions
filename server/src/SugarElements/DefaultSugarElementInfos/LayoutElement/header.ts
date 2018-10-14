import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";
import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const header: SugarElementInfo = {
    name: "header",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        visibilityPathAttribute,
        { name: "align", valueTypes: [AttributeType.Enum], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
