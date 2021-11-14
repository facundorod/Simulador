import { AnimalSpeciesI } from "./animal-speciesI";

export interface AnimalSpeciesResponseI {
    perPage: number;
    total: number;
    currentPage: number;
    data: AnimalSpeciesI[];
}
