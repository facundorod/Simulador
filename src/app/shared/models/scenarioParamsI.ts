import { SPPI } from './SPPI';
import { ArrhythmiaI } from './arrhythmiaI';
import { MedicationScenarioI } from './medicationScenarioI';
import { PathologyI } from './pathologyI';
import { PPperAsI } from './ppPerAsI';

export interface ScenarioParamsI {
    id_scenario?: number;
    name: string;
    description: string;
    created_at?: Date;
    updated_at?: Date;
    arrhythmias?: ArrhythmiaI[];
    pathologies?: PathologyI[];
    medications?: MedicationScenarioI[];
    parametersScenario?: SPPI[];
}
