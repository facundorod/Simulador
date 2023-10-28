import { ArrhythmiaI } from "./arrhythmiaI";
import { MedicationI } from "./medicationI";
import { PathologyI } from "./pathologyI";
import { PhysiologicalParamaterI } from "./physiologicalParamaterI";

export interface ScenarioI {
    id_scenario?: number;
    name: string;
    description: string;
    arrhythmias?: ArrhythmiaI[];
    medications?: MedicationI[];
    pathologies?: PathologyI[];
    parameters?: PhysiologicalParamaterI[];
    updatedAt?: Date;
    createdAt?: Date;
}
