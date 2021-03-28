export enum PhysiologicalParamaters {
    SPO2 = "SPO2",
    ETCO2 = "ETCO2",
    ECG = "ECG",
    NIBP = "NIBP",
    IBP = "IBP",
}

export class CurvesHelper {
    constructor() {}

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

    public scaleCurve(curve: number[][], scale: number = null): number[][] {
        let aux: number[][] = new Array(new Array());

        // let auxiliar: number;
        // this.capnographyData = this.capnographyData.map((cap: number[]) => {
        //     auxiliar = this.respFrequency / 60;
        //     // cap[0] = cap[0] / auxiliar;
        //     cap[1] = cap[1] / auxiliar;
        //     return cap;
        // });

        // this.plethCurveData = this.plethCurveData.map((cap: number[]) => {
        //     auxiliar = this.respFrequency / 60;
        //     // cap[0] = cap[0] / auxiliar;
        //     cap[1] = cap[1] / auxiliar;
        //     return cap;
        // });

        let aux2: number;

        for (let index = 1.0; index < 1.4; index++) {
            aux.push([index, -1.5]);
        }
        curve.forEach((value: number[]) => {
            if (value[0]) {
                aux2 = value[0] + 1;
                aux.push([aux2, -1.5]);
            }
        });

        curve.forEach((value: number[]) => {
            if (value[0]) {
                aux2 = value[0] + 2;
            }
            aux.push([aux2, value[1]]);
        });

        curve = curve.concat(aux);

        return curve;
    }
}
