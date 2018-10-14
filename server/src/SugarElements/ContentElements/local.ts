import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { typeAttribute } from "../Commons/typeAttribute";
import { fetchFnAttribute } from "../Commons/fetchFnAttribute";

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
