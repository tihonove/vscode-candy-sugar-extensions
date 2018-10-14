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

export const gridCol: SugarElementInfo = {
    name: "grid-col",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        classNameAttribute,
        {
            name: "autocalc",
            valueTypes: [AttributeType.FunctionName],
        },
        {
            name: "cols",
            valueTypes: [AttributeType.Number],
        },
    ],
};
