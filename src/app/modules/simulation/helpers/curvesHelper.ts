import { CurveValuesI } from "@app/shared/models/curveValuesI";

export interface ClosestPoint {
    lessValue: [number, number];
    greaterValue: [number, number];
}

export class CurvesHelper {

    protected curves: any[];
    constructor() { }

    public editX(curve: [number, number][], change: number = null): number[][] {
        if (!change) { change = Math.floor(Math.random() * 10); }
        curve.forEach((data: number[]) => {
            if (data[0]) { data[0] = data[0] + change; }
        });

        return curve;
    }

    public editY(curve: [number, number][], change: number = null): number[][] {
        if (!change) { change = Math.floor(Math.random() * 10); }
        curve.forEach((data: number[]) => {
            if (data[1]) { data[1] = data[1] + change; }
        });

        return curve;
    }

    /**
    * Get the max value on y-axis
    * @param curveValues
    * @returns max value for curveValues
    */
    public getMaxY(curveValues: [number, number][] | CurveValuesI[]): number {
        let maxY: number = curveValues[0][1];
        for (const curve of curveValues) {
            if (curve[1] > maxY) {
                maxY = curve[1];
            }
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
        for (const curve of curveValues) {
            if (curve[1] < minY) {
                minY = curve[1];
            }
        }
        return minY;
    }

    public linealInterpolation(x1: number, x2: number, x: number, y1: number, y2: number): number {
        const auxCalcX: number = (x - x1);
        const auxCalcY: number = (y2 - y1) / (x2 - x1);
        return ((auxCalcX * auxCalcY) + y1);
    }

    public lagrangeInterpolation(dataset: [number, number][], value: number): number {
        let count = 0;
        for (let i = 0; i < dataset.length; i++) {
            count += (dataset[i][1] * this.lagrangeFunction(dataset, value, i));
        }
        return count;
    }

    private lagrangeFunction(dataset: [number, number][], valueToInterpolate: number, i: number): number {
        let num = 1;
        let den = 1;
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
        for (let i = 0; i < dataset.length; i++) {
            if (dataset[i][0] > value) {
                if (i != 0) {
                    return {
                        lessValue: dataset[i - 1],
                        greaterValue: dataset[i]
                    };
                }
                else {
                    return {
                        lessValue: dataset[i],
                        greaterValue: dataset[i + 1]
                    };
                }
            }
        }

        return {
            lessValue: dataset[dataset.length - 1],
            greaterValue: dataset[dataset.length - 2]
        };
    }

    /**
     * Calculate new rate according to monitor's frequency and rateValue
     * @param rateValue
     * @param currentTimer
     * @param freq
     * @returns
     */
    public calculateRate(rateValue: number, freq: number): number {
        const period: number = 60 / rateValue;
        if (period) {
            return (freq / 1000) * period;
        }
        return -1;
    }

    public getMeanValue(diastolicIBP: number, systolicIBP: number): number | null {
        if (systolicIBP) { return Math.round(((2 * diastolicIBP) + systolicIBP) / 3); }
        return null;
    }
}
