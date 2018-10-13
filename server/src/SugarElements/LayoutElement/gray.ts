import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const gray: SugarElementInfo = {
    name: "gray",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [visibilityPathAttribute],
};
