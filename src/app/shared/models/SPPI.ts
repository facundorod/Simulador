import { AnimalParametersI } from "./animaParametersI";
import { CurveValuesI } from "./curveValuesI";

export interface SPPI {
    animalParameters: AnimalParametersI;
    curves: CurveValuesI[];
    id_scenario_physiological?: number;
    value: number;
}
