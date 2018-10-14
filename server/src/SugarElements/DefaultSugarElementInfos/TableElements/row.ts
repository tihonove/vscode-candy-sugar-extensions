import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";
import { pathAttribute } from "../Commons/pathAttribute";

export const row: SugarElementInfo = {
    name: "row",
    availableChildren: {
        type: AvailableChildrenType.List,
        list: ["column"],
    },
    createPathScope: true,
    attributes: [
        pathAttribute,
        { name: "kind", valueTypes: [AttributeType.String], optional: true },
        { name: "subkind", valueTypes: [AttributeType.String], optional: true },
        { name: "borderBottom", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
