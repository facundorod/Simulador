import { PhysiologicalParameterEnum } from "../enum/physiologicalParameterEnum";
import { PhysiologicalParameterSourceEnum } from "../enum/physiologicalParameterSourceEnum";
import { RefCurvesI } from "./refCurvesI";

export interface PhysiologicalParamaterI {
    id_pp: number;
    name: string;
    description: string;
    label: PhysiologicalParameterEnum;
    unit: string;
    colorLine?: string;
    specialConfiguration?: JSON;
    updated_at?: Date;
    created_at?: Date;
    source?: PhysiologicalParameterSourceEnum;
    alert_high?: number;
    alert_high_2?: number;
    order?: number;
    alert_low?: number;
    showInMonitor?: boolean;
    showCurves?: boolean;
    alert_low_2?: number;
    maxY?: number;
    value?: number;
    refCurves?: RefCurvesI[];
    curve?: [number, number][];
    normalizedCurve?: [number, number][];
    runningCurve?: string;
    disconnected?: boolean;
}
