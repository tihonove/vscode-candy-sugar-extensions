import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";
import { pathAttribute } from "../Commons/pathAttribute";

export const highlight: SugarElementInfo = {
    name: "highlight",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        pathAttribute,
        { name: "paths", valueTypes: [AttributeType.PathList] },
        { name: "change", valueTypes: [AttributeType.Enum] },
        { name: "tooltip", valueTypes: [AttributeType.String] },
    ],
};
