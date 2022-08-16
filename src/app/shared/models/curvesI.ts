import { AnimalSpeciesI } from './animal-speciesI';
import { CurvesConfigurationI } from './curvesConfigurationI';


export interface CurvesI {
    curveConfiguration: CurvesConfigurationI;
    animalSpecie: AnimalSpeciesI;
    curveValues: [number, number][];
}
