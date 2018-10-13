import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

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
};
