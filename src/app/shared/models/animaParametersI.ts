import { AnimalSpeciesI } from "./animal-speciesI";
import { PhysiologicalParamaterI } from "./physiologicalParamaterI";

export interface AnimalParametersI {
    alert_low: number;
    alert_low_2: number;
    alert_high: number;
    alert_high_2: number;
    created_at?: Date;
    updated_at?: Date;
    animalSpecie: AnimalSpeciesI;
    physiologicalParameter: PhysiologicalParamaterI;
}
