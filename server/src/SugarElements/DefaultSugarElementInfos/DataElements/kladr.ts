import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { pathAttribute } from "../Commons/pathAttribute";

export const kladr: SugarElementInfo = {
    name: "kladr",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        pathAttribute,
        fetchFnAttribute,
        { name: "title", valueTypes: [AttributeType.String] },
        { name: "kind", valueTypes: [AttributeType.Enum], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
