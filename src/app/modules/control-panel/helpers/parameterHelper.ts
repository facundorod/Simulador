import { PhysiologicalParameterEnum } from "@app/shared/enum/physiologicalParameterEnum";
import { PhysiologicalParameterSourceEnum } from "@app/shared/enum/physiologicalParameterSourceEnum";
import { PhysiologicalParamaterI } from "@app/shared/models/physiologicalParamaterI";

export class ParameterHelper {
    private static parameterMaxandMinValues = {
        ibp: {
            max: 200,
            min: 0
        },
        co2: {
            max: 50,
            min: -1
        },
        ecg: {
            max: 50,
            min: 0
        },
        spo2: {
            max: 100,
            min: 0
        }
    }
    public static getDiastolicPressure(ibpParameter: PhysiologicalParamaterI): number {
        if (ibpParameter.disconnected) return 0;
        if (ibpParameter.normalizedCurve)
            return Math.ceil(ParameterHelper.getMinValue(ibpParameter.normalizedCurve));
        return Math.ceil(ParameterHelper.getMinValue(ibpParameter.curve))
    }

    public static getSystolicPressure(ibpParameter: PhysiologicalParamaterI): number {
        if (ibpParameter.disconnected) return 0;
        if (ibpParameter.normalizedCurve)
            return Math.ceil(this.getMaxValue(ibpParameter.normalizedCurve));
        return Math.ceil(this.getMaxValue(ibpParameter.curve));
    }

    public static getInspirationCO2(capnoParameter: PhysiologicalParamaterI): number {
        if (capnoParameter.disconnected) return 0;
        if (capnoParameter.normalizedCurve)
            return Math.ceil(this.getMinValue(capnoParameter.normalizedCurve));
        return Math.ceil(this.getMinValue(capnoParameter.curve));
    }

    public static getEndTidalCO2(capnoParameter: PhysiologicalParamaterI): number {
        if (capnoParameter.disconnected) return 0;
        if (capnoParameter.normalizedCurve)
            return Math.ceil(ParameterHelper.getMaxValue(capnoParameter.normalizedCurve));
        return Math.ceil(ParameterHelper.getMaxValue(capnoParameter.curve));
    }

    public static getMaxParameterValue(parameter: PhysiologicalParamaterI): number {
        return this.parameterMaxandMinValues[parameter.label.toLowerCase()].max;
    }

    public static getMinParameterValue(parameter: PhysiologicalParamaterI): number {
        return this.parameterMaxandMinValues[parameter.label.toLowerCase()].min;
    }

    public static getMaxValue(curve: [number, number][]): number {
        return Math.max(...curve.map(point => point[1]));
    }

    public static getMeanPressure(diastolicIBP: number, systolicIBP: number): number {
        return Math.round(((2 * diastolicIBP) + systolicIBP) / 3)
    }

    public static getMinValue(curve: [number, number][]): number {
        return Math.min(...curve.map(point => point[1]));
    }

    public static isCapnoParameter(parameter: PhysiologicalParamaterI): boolean {
        return parameter.label === PhysiologicalParameterEnum.Capnography
    }

    public static isIBPParameter(parameter: PhysiologicalParamaterI): boolean {
        return parameter.label === PhysiologicalParameterEnum.InvasiveBloodPressure
    }

    public static isHeartSource(parameter: PhysiologicalParamaterI): boolean {
        return parameter.source === PhysiologicalParameterSourceEnum.Heart
    }

    public static isBreathSource(parameter: PhysiologicalParamaterI): boolean {
        return parameter.source === PhysiologicalParameterSourceEnum.Breath
    }
}
