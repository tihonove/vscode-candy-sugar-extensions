import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const formInfo: SugarElementInfo = {
    name: "formInfo",
    attributes: [
        {
            name: "name",
            optional: true,
            shortMarkdownDescription:
                "Если у формы нет КНД (например, ФСС), то указывается атрибут `name` с названием формы.",
            valueTypes: [AttributeType.String],
        },
    ],
    availableChildren: { type: AvailableChildrenType.NoChildren },
    markdownDescription: `Элемент для отображения информации из классификации: \`Форма по КНД \${КНД}, {description}, версия формата \${fp:ВерсФорм | fp:specVersion |fp:F4FORM_version}\`.
Для форм статистической отчетности неактуально.`,
};
