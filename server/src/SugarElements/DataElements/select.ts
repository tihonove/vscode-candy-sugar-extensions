// Data
import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { pathAttribute } from "../Commons/pathAttribute";
import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";
import { fetchFnAttribute } from "../Commons/fetchFnAttribute";

export const select: SugarElementInfo = {
    name: "select",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        pathAttribute,
        visibilityPathAttribute,
        typeAttribute,
        fetchFnAttribute,
        { name: "gPath", valueTypes: [AttributeType.Path], optional: true },
        { name: "width", valueTypes: [AttributeType.Number] },
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
        { name: "display", valueTypes: [AttributeType.Enum] },
        { name: "placeholder", valueTypes: [AttributeType.String], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "disabled", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "gId", valueTypes: [AttributeType.PicklistId] },
        { name: "rngAttribute", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "disablePortal", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "allowTextWrap", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
