import { AttributeTypes, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

export const responsible_fio: SugarElementInfo = {
    name: "responsible_fio",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [{ name: "caption", valueTypes: [AttributeTypes.String] }],
};
