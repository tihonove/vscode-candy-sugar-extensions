import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const typl: SugarElementInfo = {
    name: "typl",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
