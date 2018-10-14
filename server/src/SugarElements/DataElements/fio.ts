import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { pathAttribute } from "../Commons/pathAttribute";
import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const fio: SugarElementInfo = {
    name: "fio",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        pathAttribute,
        fetchFnAttribute,
        visibilityPathAttribute,
        { name: "emptydescription", valueTypes: [AttributeType.String] },
        { name: "requisite", valueTypes: [AttributeType.Boolean] },
        { name: "disabled", valueTypes: [AttributeType.Boolean] },
        { name: "editable", valueTypes: [AttributeType.Boolean] },
        { name: "quotes", valueTypes: [AttributeType.String], optional: true },
        { name: "showError", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "inline", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "template", valueTypes: [AttributeType.String], optional: true },
    ],
};
