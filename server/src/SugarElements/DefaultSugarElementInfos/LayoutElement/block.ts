import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { classNameAttribute } from "../Commons/classNameAttribute";
import { pathAttribute } from "../Commons/pathAttribute";

export const block: SugarElementInfo = {
    name: "block",
    createPathScope: true,
    attributes: [
        pathAttribute,
        classNameAttribute,
        {
            name: "visibilityPath",
            valueTypes: [AttributeType.Path],
        },
    ],
    availableChildren: { type: AvailableChildrenType.Any },
};
