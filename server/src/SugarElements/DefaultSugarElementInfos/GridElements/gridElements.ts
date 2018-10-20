import * as path from "path";

import { SugarElementGroupInfo } from "../../SugarElementGroupInfo";

import { gridCol } from "./grid-col";
import { gridRow } from "./grid-row";

export const gridElementsGroup: SugarElementGroupInfo = {
    name: "GridElements",
    caption: "Гриды",
    descriptionPath: path.join(__dirname, "README.md"),
    elements: [gridCol, gridRow],
};
