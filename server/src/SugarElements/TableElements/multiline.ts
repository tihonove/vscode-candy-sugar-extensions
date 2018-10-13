import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";

export const multiline: SugarElementInfo = {
    name: "multiline",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    createPathScope: true,
    attributes: [
        pathAttribute,
        { name: "removebutton", valueTypes: [AttributeType.Boolean] },
        { name: "addbutton", valueTypes: [AttributeType.String, AttributeType.Boolean] },
        { name: "usepager", valueTypes: [AttributeType.Boolean] },
        { name: "optional", valueTypes: [AttributeType.Boolean] },
    ],
};
