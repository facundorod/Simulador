import { MedicationI } from './medicationI';

export interface MedicationScenarioI {
    dose: number;
    unit: string;
    created_at: Date;
    updated_at: Date;
    medication: MedicationI[];
}
