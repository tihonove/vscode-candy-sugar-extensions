import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { pathAttribute } from "../Commons/pathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";

export const text: SugarElementInfo = {
    name: "text",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        pathAttribute,
        fetchFnAttribute,
        typeAttribute,
        { name: "disabled", valueTypes: [AttributeType.Boolean] },
        { name: "color", valueTypes: [AttributeType.Color] },
        { name: "requisite", valueTypes: [AttributeType.Boolean] },
        { name: "editable", valueTypes: [AttributeType.Boolean] },
        { name: "optional", valueTypes: [AttributeType.Boolean] },
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
        { name: "line", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "emptydescription", valueTypes: [AttributeType.String] },
        { name: "hint", valueTypes: [AttributeType.String], optional: true },
    ],
};
