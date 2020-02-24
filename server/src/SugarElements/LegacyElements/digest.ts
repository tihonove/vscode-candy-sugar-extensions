import { fetchFnAttribute } from "../DefaultSugarElementInfos/Commons/fetchFnAttribute";
import { pathAttribute } from "../DefaultSugarElementInfos/Commons/pathAttribute";
import { typeAttribute } from "../DefaultSugarElementInfos/Commons/typeAttribute";
import { visibilityPathAttribute } from "../DefaultSugarElementInfos/Commons/visibilityPathAttribute";
import { AttributeTypes, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const digest: SugarElementInfo = {
    name: "digest",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        pathAttribute,
        typeAttribute,
        fetchFnAttribute,
        visibilityPathAttribute,
        { name: "kind", valueTypes: [AttributeTypes.String] },
        { name: "gId", valueTypes: [AttributeTypes.Number] },
        { name: "width", valueTypes: [AttributeTypes.Number] },
        { name: "placeholder", valueTypes: [AttributeTypes.String] },
        { name: "display", valueTypes: [AttributeTypes.String] },
        { name: "savedescription", valueTypes: [AttributeTypes.Boolean] },
        { name: "title", valueTypes: [AttributeTypes.String] },
        { name: "defaultValue", valueTypes: [AttributeTypes.String], required: true },
        { name: "openbutton", valueTypes: [AttributeTypes.Boolean], required: true },
        { name: "optional", valueTypes: [AttributeTypes.Boolean], required: true },
    ],
};
