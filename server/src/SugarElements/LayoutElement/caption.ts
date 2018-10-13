import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { classNameAttribute } from "../Commons/classNameAttribute";

export const caption: SugarElementInfo = {
    name: "caption",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [classNameAttribute],
};
