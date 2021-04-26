import { CurvesService } from "@app/modules/control-panel/services/curves.service";
import { CurvesConfigurationI } from "@app/shared/models/curvesConfigurationI";
import { CurvesI } from "@app/shared/models/curvesI";
import { CurveValuesI } from "@app/shared/models/curveValuesI";
import { PhysiologicalParamaterI } from "@app/shared/models/physiologicalParamaterI";

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

    public scaleCurve(curve: number[][], period: number = null): number[][] {
        curve.forEach((data: number[]) => {
            data[0] *= period;
        });

        return curve;
    }


    public prunedParamatersData(data: CurveValuesI[]) {
        const curvesPruned: any[] = [];




        // this.curves.forEach((cv: CurvesI) => {









        //     const physiologicalParameter: PhysiologicalParamaterI =
        //         cv.ppPerAs.physiologicalParameter;
        //     switch (physiologicalParameter.label.toUpperCase()) {
        //         case PhysiologicalParamaters.SPO2: {
        //             if (!this.plethConfiguration) {
        //                 curvesPruned
        //                 this.plethConfiguration = {
        //                     label: cv.ppPerAs.physiologicalParameter.label,
        //                     unit: cv.ppPerAs.physiologicalParameter.unit,
        //                     alert_high: cv.ppPerAs.alert_high,
        //                     alert_low: cv.ppPerAs.alert_low,
        //                 };
        //             }
        //             this.plethCurve.push([+cv.t, +cv.value]);
        //             break;
        //         }
        //         case CurvesHelper.PhysiologicalParamaters.ETCO2: {
        //             if (!this.capnographyConfiguration) {
        //                 this.capnographyConfiguration = {
        //                     label: cv.ppPerAs.physiologicalParameter.label,
        //                     unit: cv.ppPerAs.physiologicalParameter.unit,
        //                     alert_high: cv.ppPerAs.alert_high,
        //                     alert_low: cv.ppPerAs.alert_low,
        //                 };
        //             }
        //             this.capnographyCurve.push([+cv.t, +cv.value]);
        //             break;
        //         }
        //         case CurvesHelper.PhysiologicalParamaters.ECG: {
        //             if (!this.ecgCurveConfiguration) {
        //                 this.ecgCurveConfiguration = {
        //                     label: cv.ppPerAs.physiologicalParameter.label,
        //                     unit: cv.ppPerAs.physiologicalParameter.unit,
        //                     alert_high: cv.ppPerAs.alert_high,
        //                     alert_low: cv.ppPerAs.alert_low,
        //                 };
        //             }
        //             this.ecgCurve.push([+cv.t, +cv.value]);
        //             break;
        //         }
        //         case CurvesHelper.PhysiologicalParamaters.IBP: {
        //             if (!this.ibpConfiguration) {
        //                 this.ibpConfiguration = {
        //                     label: cv.ppPerAs.physiologicalParameter.label,
        //                     unit: cv.ppPerAs.physiologicalParameter.unit,
        //                     alert_high: cv.ppPerAs.alert_high,
        //                     alert_low: cv.ppPerAs.alert_low,
        //                 };
        //             }
        //             this.ibpCurve.push([+cv.t, +cv.value]);
        //             break;
        //         }
        //         case CurvesHelper.PhysiologicalParamaters.NIBP: {
        //             if (!this.nibpConfiguration) {
        //                 this.nibpConfiguration = {
        //                     label: cv.ppPerAs.physiologicalParameter.label,
        //                     unit: cv.ppPerAs.physiologicalParameter.unit,
        //                     alert_high: cv.ppPerAs.alert_high,
        //                     alert_low: cv.ppPerAs.alert_low,
        //                 };
        //             }
        //             this.nibpCurve.push([+cv.t, +cv.value]);
        //             break;
        //         }
        //         case CurvesHelper.PhysiologicalParamaters.TEMP: {
        //             this.temperature = {
        //                 value: +cv.value,
        //                 label: cv.ppPerAs.physiologicalParameter.label,
        //                 unit: cv.ppPerAs.physiologicalParameter.unit,
        //                 alert_high: cv.ppPerAs.alert_high,
        //                 alert_low: cv.ppPerAs.alert_low,
        //             };
        //             this.formGroup.controls["temperature"].setValue(
        //                 this.temperature.value
        //             );
        //             break;
        //         }
        //         case CurvesHelper.PhysiologicalParamaters.RESP: {
        //             this.respFrequency = {
        //                 value: +cv.value,
        //                 label: cv.ppPerAs.physiologicalParameter.label,
        //                 unit: cv.ppPerAs.physiologicalParameter.unit,
        //                 alert_high: cv.ppPerAs.alert_high,
        //                 alert_low: cv.ppPerAs.alert_low,
        //             };
        //             this.formGroup.controls["respFrequency"].setValue(
        //                 this.respFrequency.value
        //             );
        //             break;
        //         }
        //         case CurvesHelper.PhysiologicalParamaters.CARDIAC_FREQ: {
        //             this.cardiacFrequency = {
        //                 value: +cv.value,
        //                 label: cv.ppPerAs.physiologicalParameter.label,
        //                 unit: cv.ppPerAs.physiologicalParameter.unit,
        //                 alert_high: cv.ppPerAs.alert_high,
        //                 alert_low: cv.ppPerAs.alert_low,
        //             };
        //             this.formGroup.controls["cardiacFrequency"].setValue(
        //                 this.cardiacFrequency.value
        //             );
        //             break;
        //         }
        //         default:
        //             break;
        //     }
        // });
    }





}
