import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const prsek: SugarElementInfo = {
    name: "prsek",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
