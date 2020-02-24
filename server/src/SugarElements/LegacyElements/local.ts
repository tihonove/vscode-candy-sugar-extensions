import { fetchFnAttribute } from "../DefaultSugarElementInfos/Commons/fetchFnAttribute";
import { typeAttribute } from "../DefaultSugarElementInfos/Commons/typeAttribute";
import { AttributeTypes, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const local: SugarElementInfo = {
    name: "local",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        typeAttribute,
        fetchFnAttribute,
        { name: "gIdIp", valueTypes: [AttributeTypes.PicklistId] },
        { name: "gIdOrg", valueTypes: [AttributeTypes.PicklistId] },
    ],
};
