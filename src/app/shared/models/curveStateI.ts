import { CurvesInformationI } from "./CurvesInformationI";
import { CurvesI } from "./curvesI";

export interface CurveStateI {
    breathSamplingRate?: number;
    heartSamplingRate?: number;
    curves: CurvesInformationI[]
}
