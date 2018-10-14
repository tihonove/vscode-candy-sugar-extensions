import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { pathAttribute } from "../Commons/pathAttribute";
import { fetchFnAttribute } from "../Commons/fetchFnAttribute";

export const choice: SugarElementInfo = {
    name: "choice",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        pathAttribute,
        fetchFnAttribute,
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "disabled", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "requisite", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
    ],
};
