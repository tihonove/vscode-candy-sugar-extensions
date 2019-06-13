import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";
import { fetchFnAttribute } from "../DefaultSugarElementInfos/Commons/fetchFnAttribute";
import { typeAttribute } from "../DefaultSugarElementInfos/Commons/typeAttribute";

export const local: SugarElementInfo = {
    name: "local",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        typeAttribute,
        fetchFnAttribute,
        { name: "gIdIp", valueTypes: [AttributeType.PicklistId] },
        { name: "gIdOrg", valueTypes: [AttributeType.PicklistId] },
    ],
};
