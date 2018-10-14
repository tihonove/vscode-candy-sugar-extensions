import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const nom: SugarElementInfo = {
    name: "nom",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
