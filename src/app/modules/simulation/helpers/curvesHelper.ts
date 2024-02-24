import { curvesConfiguration } from "@app/shared/constants/curves";
import { CurveValuesI } from "@app/shared/models/curveValuesI";

export interface ClosestPoint {
    lessValue: [number, number];
    greaterValue: [number, number];
}

export class CurvesHelper {

    protected curves: any[];

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

    public getMeanValue(diastolicIBP: number, systolicIBP: number): number | null {
        if (systolicIBP) { return Math.round(((2 * diastolicIBP) + systolicIBP) / 3); }
        return null;
    }


    private drawCurveTime(freqHeart: number): number {
        return (60 / freqHeart) * 1000;
    }

    public getDrawFrequency(freqHeart: number): number {
        const drawCurveTime = this.drawCurveTime(freqHeart);
        console.log("drawCurveTime", drawCurveTime)
        return Math.max(1, (drawCurveTime / curvesConfiguration.TOTAL_POINTS));
    }
}
