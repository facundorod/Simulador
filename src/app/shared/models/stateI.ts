import { AnimalSpeciesI } from "./animal-speciesI";
import { CurvesI } from "./curvesI";

export interface StatesI {
    state: number;
    newScenario: boolean;
    muteAlarms?: boolean;
    animalSpecie: AnimalSpeciesI;
    curves: CurvesI[];
    action?: string | undefined;
}
