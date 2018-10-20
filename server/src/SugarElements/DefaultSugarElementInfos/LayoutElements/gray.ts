import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const gray: SugarElementInfo = {
    name: "gray",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        visibilityPathAttribute,
        { name: "inline", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
    ],
};
