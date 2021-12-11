import { CurveValuesI } from "./curveValuesI";
import { PPperAsI } from "./ppPerAsI";

export interface PhysiologicalParameterScenarioI {
    id_scenario_physiological: number;
    value: number;
    animalParameters: PPperAsI;
    curves?: CurveValuesI[];
}
