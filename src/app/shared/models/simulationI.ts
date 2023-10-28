import { AnimalSpeciesI } from "./animal-speciesI";
import { ScenarioI } from "./scenarioI";

export interface SimulationI {
    name: string;
    scenario: ScenarioI[];
    animalSpecie: AnimalSpeciesI;
    description: string;
}
