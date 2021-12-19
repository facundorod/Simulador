import { PhysiologicalParamaterI } from "./physiologicalParamaterI";

export interface CurvesConfigurationI {
    alert_low: number;
    alert_high: number;
    label: string;
    unit: string;
    id_pp: number;
    name: string;
    description: string;
    source?: PhysiologicalParamaterI;
    colorLine?: string;
    minY?: number;
    maxY?: number;
    minValue?: number,
    maxValue?: number,
    mediumValue?: number;
    refValue?: number;
}
