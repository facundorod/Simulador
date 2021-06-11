import { CurvesService } from "@app/modules/control-panel/services/curves.service";
import { CurvesConfigurationI } from "@app/shared/models/curvesConfigurationI";
import { CurvesI } from "@app/shared/models/curvesI";
import { CurveValuesI } from "@app/shared/models/curveValuesI";
import { PhysiologicalParamaterI } from "@app/shared/models/physiologicalParamaterI";
import { StatesI } from "@app/shared/models/stateI";

enum PhysiologicalParamaters {
    SPO2 = "SPO2",
    ETCO2 = "ETCO2",
    ECG = "ECG",
    NIBP = "NIBP",
    IBP = "IBP",
    TEMP = "TEMP",
    RESP = "RESP",
    CARDIAC_FREQ = "CAR",
}

export class CurvesHelper {

    protected curves: any[];
    constructor() { }

    public editX(curve: number[][], change: number = null): number[][] {
        if (!change) change = Math.floor(Math.random() * 10);
        curve.forEach((data: number[]) => {
            if (data[0]) data[0] = data[0] + change;
        });

        return curve;
    }

    public editY(curve: number[][], change: number = null): number[][] {
        if (!change) change = Math.floor(Math.random() * 10);
        curve.forEach((data: number[]) => {
            if (data[1]) data[1] = data[1] + change;
        });

        return curve;
    }



    /**
     * Scale all curves according to heart rate or breathRate
     * @param state
     * @param heartRate
     * @param breathRate
     */
    public scaleCurves(curves: CurvesI[], heartRate: number = 0, breathRate: number = 0): void {
        if (curves) {
            curves.forEach((curve: CurvesI) => {
                if (heartRate > 0)
                    this.scaleCurve(curve.curveValues, heartRate);
                if (breathRate > 0)
                    this.scaleCurve(curve.curveValues, breathRate);
            })
        }

    }

    /**
     * Scale curve according to period
     * @param curve
     * @param period
     * @returns
     */
    private scaleCurve(curve: number[][], period: number = 1): number[][] {
        if (period != 1)
            curve.forEach((data: number[]) => {
                data[0] *= period;
            });

        return curve;
    }

}
