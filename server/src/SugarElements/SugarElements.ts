import { getDocumentation } from "@kontur.candy/generator";

import { legacyElements } from "./LegacyElements/LegacyElements";
import { SugarElementInfo } from "./SugarElementInfo";
import { tourElements } from "./TourElements/TourElements";

const elementsFromGenerator: SugarElementInfo[] = getDocumentation();

export const standardElements: SugarElementInfo[] = [...elementsFromGenerator, ...legacyElements, ...tourElements];
