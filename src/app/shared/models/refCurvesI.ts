import { CurveValuesI } from "./curveValuesI";

export interface RefCurvesI {
    name?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    dataset?: [number, number][]
}
