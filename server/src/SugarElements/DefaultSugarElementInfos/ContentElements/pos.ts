import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const pos: SugarElementInfo = {
    name: "pos",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
