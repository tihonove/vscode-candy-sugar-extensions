import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";

export const inn: SugarElementInfo = {
    name: "inn",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    createPathScope: true,
    attributes: [pathAttribute, { name: "width", valueTypes: [AttributeType.Number] }],
};
