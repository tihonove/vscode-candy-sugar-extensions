import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { pathAttribute } from "../Commons/pathAttribute";

export const choice: SugarElementInfo = {
    name: "choice",
    availableChildren: { type: AvailableChildrenType.Any },
    createPathScope: true,
    attributes: [
        pathAttribute,
        fetchFnAttribute,
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "disabled", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "requisite", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
    ],
};
