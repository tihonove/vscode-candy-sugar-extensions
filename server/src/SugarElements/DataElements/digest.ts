import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { pathAttribute } from "../Commons/pathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";
import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const digest: SugarElementInfo = {
    name: "digest",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        pathAttribute,
        typeAttribute,
        fetchFnAttribute,
        visibilityPathAttribute,
        { name: "kind", valueTypes: [AttributeType.Enum] },
        { name: "gId", valueTypes: [AttributeType.Number] },
        { name: "width", valueTypes: [AttributeType.Number] },
        { name: "placeholder", valueTypes: [AttributeType.String] },
        { name: "display", valueTypes: [AttributeType.Enum] },
        { name: "savedescription", valueTypes: [AttributeType.Boolean] },
        { name: "title", valueTypes: [AttributeType.String] },
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
        { name: "openbutton", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
