import path from "path";

import { SugarElementGroupInfo } from "../../SugarElementGroupInfo";

import { body } from "./body";
import { param } from "./param";
import { params } from "./params";
import { template } from "./template";
import { templates } from "./templates";

export const templatesElementsGroup: SugarElementGroupInfo = {
    name: "TemplatesElements",
    caption: "Шаблоны",
    descriptionPath: path.join(__dirname, "README.md"),
    elements: [body, param, params, template, templates],
};
