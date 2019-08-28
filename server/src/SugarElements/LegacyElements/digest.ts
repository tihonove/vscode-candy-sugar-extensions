import { fetchFnAttribute } from "../DefaultSugarElementInfos/Commons/fetchFnAttribute";
import { pathAttribute } from "../DefaultSugarElementInfos/Commons/pathAttribute";
import { typeAttribute } from "../DefaultSugarElementInfos/Commons/typeAttribute";
import { visibilityPathAttribute } from "../DefaultSugarElementInfos/Commons/visibilityPathAttribute";
import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

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
        { name: "defaultValue", valueTypes: [AttributeType.String], required: true },
        { name: "openbutton", valueTypes: [AttributeType.Boolean], required: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], required: true },
    ],
};
