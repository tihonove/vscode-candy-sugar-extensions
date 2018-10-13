import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";

export const radiogroup: SugarElementInfo = {
    name: "radiogroup",
    availableChildren: {
        type: AvailableChildrenType.List,
        list: ["radio"],
    },
    attributes: [
        pathAttribute,
        {
            name: "defaultValue",
            valueTypes: [AttributeType.String],
        },
    ],
};