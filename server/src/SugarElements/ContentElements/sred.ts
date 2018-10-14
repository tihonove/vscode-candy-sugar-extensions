import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const sred: SugarElementInfo = {
    name: "sred",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
