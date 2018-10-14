import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const sektor: SugarElementInfo = {
    name: "sektor",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
