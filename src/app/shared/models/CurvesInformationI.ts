import { PhysiologicalParameterEnum } from "../enum/PhysiologicalParameterEnum";

export interface CurvesInformationI {
    dataset: [number, number][],
    alert_low: number;
    alert_high: number;
    alert_high_2?: number;
    alert_low_2?: number;
    label: string;
    unit: string;
    name: string;
    description: string;
    colorLine: string;
    minY: number;
    maxY: number;
    source?: PhysiologicalParameterEnum;
    showCurves?: boolean;
}
