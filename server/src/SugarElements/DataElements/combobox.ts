import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { pathAttribute } from "../Commons/pathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";

export const combobox: SugarElementInfo = {
    name: "combobox",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        pathAttribute,
        fetchFnAttribute,
        typeAttribute,
        { name: "maxLength", valueTypes: [AttributeType.Number] },
        { name: "limit", valueTypes: [AttributeType.Number] },
        { name: "useincorrectvalue", valueTypes: [AttributeType.Boolean] },
        { name: "placeholder", valueTypes: [AttributeType.String] },
        { name: "gId", valueTypes: [AttributeType.PicklistId] },
        { name: "optional", valueTypes: [AttributeType.Boolean] },
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
        { name: "title", valueTypes: [AttributeType.String], optional: true },
    ],
};
