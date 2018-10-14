import { SugarElementInfo } from "../SugarElementInfo";

import { checkbox } from "./DataElements/checkbox";
import { column } from "./TableElements/column";
import { row } from "./TableElements/row";

export const Row: SugarElementInfo = { ...row, name: "Row" };
export const Column: SugarElementInfo = { ...column, name: "Column" };
export const Checkbox: SugarElementInfo = { ...checkbox, name: "Checkbox" };
