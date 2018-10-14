import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const katpos: SugarElementInfo = {
    name: "katpos",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
