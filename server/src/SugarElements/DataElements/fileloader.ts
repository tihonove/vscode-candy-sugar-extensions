import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";
import { pathAttribute } from "../Commons/pathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";

export const fileloader: SugarElementInfo = {
    name: "fileloader",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        pathAttribute,
        typeAttribute,
        { name: "width", valueTypes: [AttributeType.Number] },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
