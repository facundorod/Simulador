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

export type ClosestPoint = {
    lessValue: [number, number],
    greaterValue: [number, number]
}

export class CurvesHelper {

    protected curves: any[];
    constructor() { }

    public editX(curve: [number, number][], change: number = null): number[][] {
        if (!change) change = Math.floor(Math.random() * 10);
        curve.forEach((data: number[]) => {
            if (data[0]) data[0] = data[0] + change;
        });

        return curve;
    }

    public editY(curve: [number, number][], change: number = null): number[][] {
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
                    this.scaleCurveHeart(curve, heartRate);
                if (breathRate > 0)
                    this.scaleCurveBreath(curve, breathRate);
            })
        }

    }

    /**
     * Scale curves associated with heart rate
     * @param curve
     * @param period
     * @returns
     */
    private scaleCurveHeart(curve: CurvesI, period: number = 1): [number, number][] {
        if (period != 1) {
            if (curve.curveConfiguration.rate === 'heart') {
                curve.curveValues.forEach((data: number[]) => {
                    data[0] *= period;
                });
            }
        }
        return curve.curveValues;

    }

    /**
     * Scale curves associated with breath rate
     * @param curve
     * @param period
     * @returns
     */
    private scaleCurveBreath(curve: CurvesI, period: number = 1): [number, number][] {
        if (period != 1) {
            if (curve.curveConfiguration.rate === 'breath') {
                curve.curveValues.forEach((data: number[]) => {
                    data[0] *= period;
                });
            }
        }
        return curve.curveValues;

    }

    /**
     * Resample curve according to period until max
     * @param curve
     * @param period
     * @param maxSamples
     */
    public reSampleCurve(curve: [number, number][], period: number, maxSamples: number) {
        if (curve) {
            let iterator: number = 0;
            let auxValue: number[] = curve[iterator];
            iterator++;
            while (auxValue[0] + period <= maxSamples) {
                curve.push([auxValue[0] + period, auxValue[1]]);
                curve.sort((a: number[], b: number[]) => {
                    return a[0] - b[0];
                });
                auxValue = curve[iterator];
                iterator++;
            }

        }
    }

    /**
    * Get the max value on y-axis
    * @param curveValues
    * @returns max value for curveValues
    */
    public getMaxY(curveValues: [number, number][]): number {
        let maxY: number = curveValues[0][1];
        for (let curve of curveValues) {
            if (curve[1] > maxY)
                maxY = curve[1];
        }
        return maxY;
    }

    /**
     * Get the min value on y-axis
     * @param curveValues
     * @returns min value for curveValues
     */
    public getMinY(curveValues: [number, number][]): number {
        let minY: number = curveValues[0][1];
        for (let curve of curveValues) {
            if (curve[1] < minY)
                minY = curve[1];
        }
        return minY;
    }

    public linealInterpolation(x1: number, x2: number, x: number, y1: number, y2: number): number {
        const auxCalcX: number = (x - x1) / (x2 - x1);
        const auxCalcY: number = y2 - y1;
        return ((auxCalcX * auxCalcY) + y1);
    }

    public lagrangeInterpolation(dataset: [number, number][], value: number): number {
        let count: number = 0;
        for (let i = 0; i < dataset.length; i++) {
            count += (dataset[i][1] * this.lagrangeFunction(dataset, value, i));
        }
        return count;
    }

    private lagrangeFunction(dataset: [number, number][], valueToInterpolate: number, i: number): number {
        let num: number = 1;
        let den: number = 1;
        for (let j = 0; j < dataset.length - 1; j++) {
            if (i != j) {
                num *= (valueToInterpolate - dataset[j][0]);
                den *= (dataset[i][0] - dataset[j][0]);
            }
        }
        return num / den;
    }

    /**
     * Return the two closest values to @param value
     * @param dataset
     * @param value
     */
    public getClosestIndex(dataset: [number, number][], value: number): ClosestPoint {
        for (let i: number = 0; i < dataset.length; i++) {
            if (dataset[i][0] > value) {
                if (i != 0)
                    return {
                        lessValue: dataset[i - 1],
                        greaterValue: dataset[i]
                    }
                else
                    return {
                        lessValue: dataset[i],
                        greaterValue: dataset[i + 1]
                    }
            };
        }

        return {
            lessValue: dataset[dataset.length - 1],
            greaterValue: dataset[dataset.length - 2]
        }
    }
}
