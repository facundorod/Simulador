import { AnimalSpeciesI } from "./animal-speciesI";
import { CurvesI } from "./curvesI";

export interface StatesI {
    state: number,
    animalSpecie: AnimalSpeciesI;
    curves: CurvesI[];
    action?: string | undefined;
}
