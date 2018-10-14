import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const typl: SugarElementInfo = {
    name: "typl",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
