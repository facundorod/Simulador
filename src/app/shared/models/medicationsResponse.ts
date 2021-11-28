import { MedicationI } from "./medicationI";

export interface MedicationResponseI {
    perPage: number;
    total: number;
    currentPage: number;
    data: MedicationI[];
}
