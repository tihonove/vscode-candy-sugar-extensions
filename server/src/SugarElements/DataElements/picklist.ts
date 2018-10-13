import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";

export const picklist: SugarElementInfo = {
    name: "picklist",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        {
            name: "align",
            valueTypes: [AttributeType.String],
        },
        {
            name: "kind",
            valueTypes: [AttributeType.String],
        },
        {
            name: "gId",
            valueTypes: [AttributeType.PicklistId],
        },
        {
            name: "title",
            valueTypes: [AttributeType.String],
        },
        {
            name: "width",
            valueTypes: [AttributeType.Number],
        },
        pathAttribute,
        {
            name: "binding",
            valueTypes: [AttributeType.JavaScriptLiteral],
        },
        {
            name: "fields",
            valueTypes: [AttributeType.JavaScriptLiteral],
        },
        {
            name: "headers",
            valueTypes: [AttributeType.JavaScriptLiteral],
        },
        {
            name: "columnsWidth",
            valueTypes: [AttributeType.JavaScriptLiteral],
        },
        typeAttribute,
    ],
};
