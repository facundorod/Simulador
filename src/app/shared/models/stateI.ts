import { AnimalSpeciesI } from "./animal-speciesI";
import { CurvesI } from "./curvesI";

export interface StatesI {
    state: Number,
    animalSpecie: AnimalSpeciesI;
    curves: CurvesI[];
    action?: string | undefined;
}
