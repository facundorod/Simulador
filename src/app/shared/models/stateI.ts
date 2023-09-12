import { AnimalSpeciesI } from './animal-speciesI';
import { CurvesI } from './curvesI';
import { ScenarioI } from './scenarioI';

export interface StatesI {
    scenario: ScenarioI;
    state: number;
    newScenario?: boolean;
    muteAlarms?: boolean;
    animalSpecie: AnimalSpeciesI;
    curves: CurvesI[];
    action?: string | undefined;
    heartSamplingRate?: number;
    breathSamplingRate?: number;
    totalPoints?: number;
    totalPointsPerCycle?: number;
}
