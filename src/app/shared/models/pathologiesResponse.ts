import { PathologyI } from "./pathologyI";

export interface PathologiesResponseI {
    perPage: number;
    total: number;
    currentPage: number;
    data: PathologyI[];
}
