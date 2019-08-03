import { elementsFromGenerator } from "./CompileTimeDocumentation/CompileTimeDocumentationFromGenerator";
import { legacyElements } from "./LegacyElements/LegacyElements";
import { SugarElementInfo } from "./SugarElementInfo";
import { tourElements } from "./TourElements/TourElements";

export const standardElements: SugarElementInfo[] = [...elementsFromGenerator, ...legacyElements, ...tourElements];
