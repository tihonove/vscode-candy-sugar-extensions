import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { pathAttribute } from "../Commons/pathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";
import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const text: SugarElementInfo = {
    name: "text",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        pathAttribute,
        fetchFnAttribute,
        typeAttribute,
        visibilityPathAttribute,
        { name: "disabled", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "color", valueTypes: [AttributeType.Color], optional: true },
        { name: "requisite", valueTypes: [AttributeType.Boolean] },
        { name: "editable", valueTypes: [AttributeType.Boolean] },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
        { name: "line", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "emptydescription", valueTypes: [AttributeType.String] },
        { name: "hint", valueTypes: [AttributeType.String], optional: true },
        { name: "title", valueTypes: [AttributeType.String], optional: true },
        { name: "help", valueTypes: [AttributeType.String], optional: true },
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
        { name: "rngAttribute", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "auto", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "tooltipWidth", valueTypes: [AttributeType.Number], optional: true },
        { name: "showError", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "for", valueTypes: [AttributeType.String], optional: true },
        { name: "quotes", valueTypes: [AttributeType.String], optional: true },
    ],
};
