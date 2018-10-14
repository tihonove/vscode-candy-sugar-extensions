import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const typeElement: SugarElementInfo = {
    name: "type",
    availableChildren: {
        type: AvailableChildrenType.List,
        list: [
            "customValidation",
            "enumeration",
            "fractionDigits",
            "length",
            "maxLength",
            "minLength",
            "pattern",
            "totalDigits",
            "type",
            "types",
        ],
    },
    attributes: [
        {
            name: "name",
            valueTypes: [AttributeType.String],
            shortMarkdownDescription: "Наименование типа",
        },
        {
            name: "base",
            valueTypes: [AttributeType.String],
            shortMarkdownDescription: "Имя базовго типа",
        },
        {
            name: "description",
            valueTypes: [AttributeType.String],
        },
        {
            name: "requiredDescription",
            valueTypes: [AttributeType.String],
        },
    ],
};
