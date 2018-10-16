import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";

export const picklist: SugarElementInfo = {
    name: "picklist",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        { name: "align", valueTypes: [AttributeType.String] },
        { name: "kind", valueTypes: [AttributeType.String] },
        { name: "gId", valueTypes: [AttributeType.PicklistId] },
        { name: "title", valueTypes: [AttributeType.String] },
        { name: "width", valueTypes: [AttributeType.Number] },
        pathAttribute,
        { name: "binding", valueTypes: [AttributeType.JavaScriptLiteral] },
        { name: "fields", valueTypes: [AttributeType.JavaScriptLiteral] },
        { name: "headers", valueTypes: [AttributeType.JavaScriptLiteral] },
        { name: "columnsWidth", valueTypes: [AttributeType.JavaScriptLiteral] },
        { name: "multiple", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "narrowbutton", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "textOverflow", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "normativehelp", valueTypes: [AttributeType.JavaScriptLiteral], optional: true },
        { name: "placeholder", valueTypes: [AttributeType.String], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "limit", valueTypes: [AttributeType.Number], optional: true },
        { name: "overwriteOnInit", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "gPath", valueTypes: [AttributeType.Path], optional: true },
        { name: "field", valueTypes: [AttributeType.String], optional: true },
        { name: "valueField", valueTypes: [AttributeType.String], optional: true },
        { name: "display", valueTypes: [AttributeType.Enum], optional: true },
        { name: "savedescription", valueTypes: [AttributeType.Boolean], optional: true },
        typeAttribute,
    ],
};