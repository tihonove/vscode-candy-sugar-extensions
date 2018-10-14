import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const org_type: SugarElementInfo = {
    name: "org_type",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
