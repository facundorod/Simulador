import { AnimalSpeciesI } from "./animal-speciesI";
import { PhysiologicalParamaterI } from "./physiologicalParamaterI";

export interface AnimalParametersI {
    alert_low: number;
    alert_high: number;
    created_at?: Date;
    updated_at?: Date;
    animalSpecie: AnimalSpeciesI;
    physiologicalParameter: PhysiologicalParamaterI;
}
