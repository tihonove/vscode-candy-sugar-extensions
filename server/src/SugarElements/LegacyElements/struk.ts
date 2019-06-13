import { AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const struk: SugarElementInfo = {
    name: "struk",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
