import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { pathAttribute } from "../Commons/pathAttribute";

export const column: SugarElementInfo = {
    name: "column",
    attributes: [
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
        { name: "colspan", valueTypes: [AttributeType.Number], optional: true },
        { name: "multiple", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "hintOnAdd", valueTypes: [AttributeType.String], optional: true },
        { name: "titles", valueTypes: [AttributeType.JavaScriptLiteral], optional: true },
        { ...pathAttribute, optional: true },
    ],
    createPathScope: true,
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
};
