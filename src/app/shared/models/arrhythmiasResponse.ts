import { ArrhythmiaI } from "./arrhythmiaI";

export interface ArrhythmiaResponseI {
    perPage: number;
    total: number;
    currentPage: number;
    data: ArrhythmiaI[];
}
