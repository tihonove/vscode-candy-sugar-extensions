import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const nom: SugarElementInfo = {
    name: "nom",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
