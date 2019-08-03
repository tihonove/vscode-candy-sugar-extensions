// Content elements
import { AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";
import { typeAttribute } from "../DefaultSugarElementInfos/Commons/typeAttribute";

export const kpp: SugarElementInfo = {
    name: "kpp",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [typeAttribute],
};
