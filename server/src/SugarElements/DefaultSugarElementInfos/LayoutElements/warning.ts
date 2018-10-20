import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const warning: SugarElementInfo = {
    name: "warning",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [visibilityPathAttribute],
};
