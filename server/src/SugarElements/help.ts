import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../Suggester/SugarElementInfo";

import { visibilityPathAttribute } from "./Commons/visibilityPathAttribute";

export const help: SugarElementInfo = {
    name: "help",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        visibilityPathAttribute,
        {
            name: "trigger",
            valueTypes: [AttributeType.String],
        },
    ],
};
