import path from "path";

import { SugarElementGroupInfo } from "../../SugarElementGroupInfo";

import { form } from "./form";
import { formInfo } from "./formInfo";
import { normativehelp } from "./normativehelp";
import { sugar } from "./sugar";

export const systemElementsGroup: SugarElementGroupInfo = {
    name: "SystemElements",
    caption: "Управляющие элементы",
    descriptionPath: path.join(__dirname, "README.md"),
    elements: [form, formInfo, normativehelp, sugar],
};
