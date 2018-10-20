import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";
import { classNameAttribute } from "../Commons/classNameAttribute";

export const caption: SugarElementInfo = {
    name: "caption",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [classNameAttribute],
};
