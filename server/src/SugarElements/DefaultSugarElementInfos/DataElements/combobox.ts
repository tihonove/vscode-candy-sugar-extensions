import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

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
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
        { name: "maxLength", valueTypes: [AttributeType.Number] },
        { name: "limit", valueTypes: [AttributeType.Number] },
        { name: "useincorrectvalue", valueTypes: [AttributeType.Boolean] },
        { name: "placeholder", valueTypes: [AttributeType.String] },
        { name: "savedescription", valueTypes: [AttributeType.String], optional: true },
        { name: "display", valueTypes: [AttributeType.Enum], optional: true },
        { name: "displayItem", valueTypes: [AttributeType.Enum], optional: true },
        { name: "gId", valueTypes: [AttributeType.PicklistId] },
        { name: "optional", valueTypes: [AttributeType.Boolean] },
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
        { name: "title", valueTypes: [AttributeType.String], optional: true },
        { name: "gPath", valueTypes: [AttributeType.String], optional: true },
        { name: "disabled", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "rngAttribute", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "openbutton", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
