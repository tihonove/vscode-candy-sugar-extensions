import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { pathAttribute } from "../Commons/pathAttribute";

export const checkbox: SugarElementInfo = {
    name: "checkbox",
    attributes: [
        {
            name: "type",
            valueTypes: [AttributeType.String],
        },
        {
            name: "defaultValue",
            valueTypes: [AttributeType.String],
        },
        {
            name: "checkedValue",
            valueTypes: [AttributeType.String],
        },
        {
            name: "uncheckedValue",
            valueTypes: [AttributeType.String],
        },
        {
            name: "optional",
            valueTypes: [AttributeType.Boolean],
        },
        pathAttribute,
    ],
    availableChildren: { type: AvailableChildrenType.Any },
};
