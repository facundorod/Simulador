import { PhysiologicalParameterSourceEnum } from "../enum/physiologicalParameterSourceEnum";

export interface CurvesInformationI {
    dataset: [number, number][],
    alert_low: number;
    alert_high: number;
    alert_high_2?: number;
    id_pp: number;
    alert_low_2?: number;
    label: string;
    unit: string;
    name: string;
    description: string;
    colorLine: string;
    minY: number;
    maxY: number;
    source?: PhysiologicalParameterSourceEnum;
    showCurves?: boolean;
}
