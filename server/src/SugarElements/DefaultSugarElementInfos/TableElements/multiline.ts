import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";

export const multiline: SugarElementInfo = {
    name: "multiline",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    createPathScope: true,
    attributes: [
        pathAttribute,
        { name: "addType", valueTypes: [AttributeType.Enum], optional: true },
        { name: "pageStep", valueTypes: [AttributeType.Number], optional: true },
        { name: "focusByHotkey", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "removebutton", valueTypes: [AttributeType.Boolean] },
        { name: "addbutton", valueTypes: [AttributeType.Boolean, AttributeType.String] },
        { name: "usepager", valueTypes: [AttributeType.Boolean] },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "rowmenu", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
