import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";

export const table: SugarElementInfo = {
    name: "table",
    availableChildren: {
        type: AvailableChildrenType.List,
        list: ["row", "multiline"],
    },
    attributes: [
        pathAttribute,
        {
            name: "multiple",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "width",
            valueTypes: [AttributeType.Number],
        },
        {
            name: "stickyHeader",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "addbutton",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "removebutton",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "usepager",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "grayColumn",
            valueTypes: [AttributeType.Number],
        },
    ],
};
