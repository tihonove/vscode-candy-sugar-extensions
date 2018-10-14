// Content elements
import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { typeAttribute } from "../Commons/typeAttribute";

export const kpp: SugarElementInfo = {
    name: "kpp",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [typeAttribute],
};
