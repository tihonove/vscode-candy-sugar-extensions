import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { classNameAttribute } from "../Commons/classNameAttribute";

export const block: SugarElementInfo = {
    name: "block",
    attributes: [
        classNameAttribute,
        {
            name: "visibilityPath",
            valueTypes: [AttributeType.Path],
        },
    ],
    availableChildren: { type: AvailableChildrenType.Any },
};
