import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";

export const date: SugarElementInfo = {
    name: "date",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [pathAttribute, typeAttribute, { name: "width", valueTypes: [AttributeType.Number] }],
};
