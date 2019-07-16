import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const param: SugarElementInfo = {
    name: "param",
    attributes: [
        {
            name: "name",
            valueTypes: [AttributeType.String],
            shortMarkdownDescription: "Имя аргумента",
        },
        {
            name: "type",
            valueTypes: [AttributeType.TemplateParameterType],
            shortMarkdownDescription: "Тип аргумента",
        },
        {
            name: "required",
            valueTypes: [AttributeType.Boolean],
            optional: true,
        },
    ],
    availableChildren: { type: AvailableChildrenType.NoChildren },
};
