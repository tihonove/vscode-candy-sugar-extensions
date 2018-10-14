import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";
import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { typeAttribute } from "../Commons/typeAttribute";

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
