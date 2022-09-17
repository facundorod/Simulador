import { CurveValuesI } from "./curveValuesI";

export interface RefCurvesI {
    id_curve?: number;
    curves: CurveValuesI[];
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}
