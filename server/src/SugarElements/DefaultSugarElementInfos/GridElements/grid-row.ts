import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";
import { classNameAttribute } from "../Commons/classNameAttribute";

export const gridRow: SugarElementInfo = {
    name: "grid-row",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        classNameAttribute,
        {
            name: "cols",
            valueTypes: [AttributeType.Number],
        },
    ],
};
