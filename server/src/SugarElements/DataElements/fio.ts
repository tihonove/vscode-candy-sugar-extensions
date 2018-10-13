import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { pathAttribute } from "../Commons/pathAttribute";

export const fio: SugarElementInfo = {
    name: "fio",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        pathAttribute,
        fetchFnAttribute,
        {
            name: "emptydescription",
            valueTypes: [AttributeType.String],
        },
        {
            name: "requisite",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "disabled",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "editable",
            valueTypes: [AttributeType.Boolean],
        },
    ],
};
