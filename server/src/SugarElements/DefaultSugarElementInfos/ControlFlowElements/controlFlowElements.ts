import path from "path";

import { SugarElementGroupInfo } from "../../SugarElementGroupInfo";

import { choice } from "./choice";
import { elseElement } from "./else";
import { ifElement } from "./if";
import { otherwise } from "./otherwise";
import { then } from "./then";
import { when } from "./when";

export const controlFlowElements: SugarElementGroupInfo = {
    name: "ControlFlowElements",
    caption: "Условный рендеринг",
    descriptionPath: path.join(__dirname, "README.md"),
    elements: [ifElement, then, elseElement, choice, when, otherwise],
};
