import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const okogu: SugarElementInfo = {
    name: "okogu",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
