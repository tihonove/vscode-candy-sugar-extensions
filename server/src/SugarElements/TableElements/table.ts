import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";
import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const table: SugarElementInfo = {
    name: "table",
    availableChildren: {
        type: AvailableChildrenType.List,
        list: ["row", "multiline"],
    },
    createPathScope: true,
    attributes: [
        pathAttribute,
        visibilityPathAttribute,
        { name: "multiple", valueTypes: [AttributeType.Boolean] },
        { name: "width", valueTypes: [AttributeType.Number] },
        { name: "stickyHeader", valueTypes: [AttributeType.Boolean] },
        { name: "addbutton", valueTypes: [AttributeType.Boolean] },
        { name: "crossfit", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "rowmenu", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "removebutton", valueTypes: [AttributeType.Boolean] },
        { name: "usepager", valueTypes: [AttributeType.Boolean] },
        { name: "grayColumn", valueTypes: [AttributeType.Number] },
        { name: "doNotCopyPaths", valueTypes: [AttributeType.Path], optional: true },
        { name: "columnGrouping", valueTypes: [AttributeType.JavaScriptLiteral], optional: true },
    ],
};
