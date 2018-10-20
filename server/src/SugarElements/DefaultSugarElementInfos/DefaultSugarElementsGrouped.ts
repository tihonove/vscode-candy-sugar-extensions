import { SugarElementGroupInfo } from "../SugarElementGroupInfo";

import { controlFlowElements } from "./ControlFlowElements/controlFlowElements";
import { dataElementsGroup } from "./DataElements/dataElementsGroup";
import { gridElementsGroup } from "./GridElements/gridElements";
import { layoutElementsGroup } from "./LayoutElements/layoutElementsGroup";
import { listElementsGroup } from "./ListElements/listElementsGroup";
import { systemElementsGroup } from "./SystemElements/systemElementsGroup";
import { tableElementsGroup } from "./TableElements/tableElementsGroup";
import { tourElementsGroup } from "./TourElements/tourElementsGroup";
import { typeDefinitionElementsGroup } from "./TypeDefinitionElements/typeDefinitionElementsGroup";

export const sugarElementsGroups: SugarElementGroupInfo[] = [
    dataElementsGroup,
    controlFlowElements,
    gridElementsGroup,
    layoutElementsGroup,
    listElementsGroup,
    systemElementsGroup,
    tableElementsGroup,
    tourElementsGroup,
    typeDefinitionElementsGroup,
];
