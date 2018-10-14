import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";

export const link: SugarElementInfo = {
    name: "link",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        { name: "href", valueTypes: [AttributeType.String], optional: true },
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
        pathAttribute,
        { name: "onClick", valueTypes: [AttributeType.FunctionName], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
