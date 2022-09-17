import { AnimalSpeciesI } from "./animal-speciesI";
import { PhysiologicalParamaterI } from "./physiologicalParamaterI";
import { RefCurvesI } from "./refCurvesI";

export interface RefCurvesResponse {
    curves: RefCurvesI;
    animal: AnimalSpeciesI;
    parameter: PhysiologicalParamaterI;
}
