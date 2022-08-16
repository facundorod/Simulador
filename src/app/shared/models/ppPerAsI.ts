import { AnimalSpeciesI } from './animal-speciesI';
import { PhysiologicalParamaterI } from './physiologicalParamaterI';

export interface PPperAsI {
    alertLow: number;
    alertHigh: number;
    physiologicalParameter: PhysiologicalParamaterI;
    animalSpecie?: AnimalSpeciesI;
}
