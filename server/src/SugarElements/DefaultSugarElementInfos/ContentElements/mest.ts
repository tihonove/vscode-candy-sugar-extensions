import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const mest: SugarElementInfo = {
    name: "mest",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
