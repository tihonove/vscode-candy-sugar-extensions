import { pathAttribute } from "../DefaultSugarElementInfos/Commons/pathAttribute";
import {
    invisibilityPathAttribute,
    invisibilityPathValuettribute,
    visibilityPathAttribute,
    visibilityPathValueAttribute,
} from "../DefaultSugarElementInfos/Commons/visibilityPathAttribute";
import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const content: SugarElementInfo = {
    name: "content",
    availableChildren: {
        type: AvailableChildrenType.List,
        list: [
            "togs",
            "year",
            "period",
            "okpo",
            "name",
            "leader_fio",
            "responsible_post",
            "responsible_fio",
            "phone",
            "email",
        ],
    },
    createPathScope: true,
    attributes: [
        pathAttribute,
        visibilityPathAttribute,
        visibilityPathValueAttribute,
        invisibilityPathAttribute,
        invisibilityPathValuettribute,
        { name: "style", valueTypes: [AttributeType.JavaScriptLiteral], required: false },
    ],
};
