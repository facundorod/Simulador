import { PhysiologicalParameterEnum } from '../enum/PhysiologicalParameterEnum';
import { PhysiologicalParamaterI } from './physiologicalParamaterI';

export interface CurvesConfigurationI {
    alert_low: number;
    alert_high: number;
    alert_high_2: number;
    alert_low_2: number;
    label: string;
    unit: string;
    id_pp: number;
    name: string;
    description: string;
    source?: PhysiologicalParameterEnum;
    colorLine?: string;
    minY?: number;
    maxY?: number;
    minValue?: number;
    maxValue?: number;
    mediumValue?: number;
    refValue?: number;
    showMonitor?: boolean;
}
