import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const help: SugarElementInfo = {
    name: "help",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        visibilityPathAttribute,
        { name: "trigger", valueTypes: [AttributeType.String] },
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
        { name: "pos", valueTypes: [AttributeType.Enum], optional: true },
    ],
};
