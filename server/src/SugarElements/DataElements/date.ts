import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { pathAttribute } from "../Commons/pathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";

export const date: SugarElementInfo = {
    name: "date",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        pathAttribute,
        typeAttribute,
        fetchFnAttribute,
        { name: "width", valueTypes: [AttributeType.Number] },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "placeholder", valueTypes: [AttributeType.String], optional: true },
        { name: "disabled", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "tooltipWidth", valueTypes: [AttributeType.Number], optional: true },
    ],
};
