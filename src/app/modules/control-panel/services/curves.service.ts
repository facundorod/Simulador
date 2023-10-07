import { Injectable } from '@angular/core';
import { curvesConfiguration } from '@app/shared/constants/curves';
import { CurveStateI } from '@app/shared/models/curveStateI';
import { RefCurvesResponse } from '@app/shared/models/refCurvesResponse';
import { StatesI } from '@app/shared/models/stateI';
import { ApiService } from '@app/shared/services/api.service';
import { HelperService } from '@app/shared/services/helper.service';
import { environment } from '@environments/environment';
import { Observable, Subject } from 'rxjs';
import { InterpolatorService } from './interpolator.service';
import { PhysiologicalParameterEnum } from '@app/shared/enum/physiologicalParameterEnum';
import { PhysiologicalParameterSourceEnum } from '@app/shared/enum/physiologicalParameterSourceEnum';

@Injectable()
export class CurvesService {
    private interpolatorService: InterpolatorService;

    constructor(private api: ApiService) {
        this.interpolatorService = new InterpolatorService();
    }

    /**
     * Find all curves according to @param query
     * @param query
     * @param order
     * @returns
     */
    public findAll(query: any = null, order: any = null) {
        const subject = new Subject<any>();

        let endpoint = environment.api.curves;

        if (query) { endpoint += `?${HelperService.getQueryString(query)}`; }

        this.api.httpGet(endpoint).subscribe(
            (curves: any) => {
                subject.next(curves);
            },
            (error: any) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public shiftCurve(curve: [number, number][], valueToShift: number): Observable<[number, number][]> {
        const subject = new Subject<[number, number][]>();

        const endpoint = environment.api.curves + 'shift';


        this.api.httpPost(endpoint, { curve, valueToShift }).subscribe(
            (curves: [number, number][]) => {
                subject.next(curves);
            },
            (error: Error) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public normalizeCurve(curve: [number, number][]): Observable<[number, number][]> {
        const subject = new Subject<[number, number][]>();

        const endpoint = environment.api.curves + 'normalize';


        this.api.httpPost(endpoint, { curve }).subscribe(
            (curves: [number, number][]) => {
                subject.next(curves);
            },
            (error: Error) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public calculateAmplitude(curve: [number, number][], valueToExtend: number): Observable<[number, number][]> {
        const subject = new Subject<[number, number][]>();

        const endpoint = environment.api.curves + 'amplitude';


        this.api.httpPost(endpoint, { curve, valueToExtend }).subscribe(
            (curves: [number, number][]) => {
                subject.next(curves);
            },
            (error: Error) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public updatePressure(curve: [number, number][], systolicValue: number, diastolicValue: number): Observable<[number, number][]> {
        const subject = new Subject<[number, number][]>();

        const endpoint = environment.api.curves + 'update-pressure';


        this.api.httpPost(endpoint, { curve, systolic: systolicValue, diastolic: diastolicValue }).subscribe(
            (curves: [number, number][]) => {
                subject.next(curves);
            },
            (error: Error) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public updateCO2(curve: [number, number][], endTidalCO2: number, inspirationCO2: number): Observable<[number, number][]> {
        const subject = new Subject<[number, number][]>();

        const endpoint = environment.api.curves + 'update-co2';


        this.api.httpPost(endpoint, { curve, endTidalCO2, inspirationCO2 }).subscribe(
            (curves: [number, number][]) => {
                subject.next(curves);
            },
            (error: Error) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public updateHeartRate(curves: StatesI, heartRate: number): Observable<StatesI> {
        const subject = new Subject<StatesI>();

        const endpoint = environment.api.curves + 'update-heart-rate';


        this.api.httpPost(endpoint, { curves, heartRate }).subscribe(
            (curves: StatesI) => {
                subject.next(curves);
            },
            (error: Error) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public updateHeartRate2(curves: CurveStateI, heartRate: number, currentHeartRate: number): Observable<CurveStateI> {
        const subject = new Subject<CurveStateI>();

        const endpoint = environment.api.curvesV2 + 'update-heart-rate';


        this.api.httpPost(endpoint, { curves, newHeartRate: heartRate, currentHeartRate }).subscribe(
            (curves: CurveStateI) => {
                subject.next(curves);
            },
            (error: Error) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public updateRespirationRate(curves: StatesI, breathRate: number): Observable<StatesI> {
        const subject = new Subject<StatesI>();

        const endpoint = environment.api.curves + 'update-breath-rate';


        this.api.httpPost(endpoint, { curves, breathRate }).subscribe(
            (curves: StatesI) => {
                subject.next(curves);
            },
            (error: Error) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public getRefCurves(animalId: number, parameter: string): Observable<RefCurvesResponse[]> {
        const subject = new Subject<RefCurvesResponse[]>();

        const endpoint = `${environment.api.refCurves}?animalId=${animalId}&parameter=${parameter}`;

        this.api.httpGet(endpoint).subscribe(
            (refCurves: RefCurvesResponse[]) => {
                subject.next(refCurves);
            },
            (error: Error) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        )
        return subject.asObservable();
    }



    /**
      * Normaliza la curva de acuerdo a la frecuencia cardíaca
      * @param dataset
      * @param freqRate
      */
    public normalizeHRCurve(dataset: [number, number][], freqRate: number = 60): [number, number][] {
        const normalizedCurve = [];
        const lastElement = dataset[dataset.length - 1];
        const freqCurve: number = 60 / freqRate;
        let time: number = 0.0;
        const constantPoints: number = (curvesConfiguration.TOTAL_POINTS * freqCurve) - curvesConfiguration.CURVE_POINTS;
        debugger;
        while (time < curvesConfiguration.MAX_MONITOR) {
            for (let i = 0; i < constantPoints / 2 && time < curvesConfiguration.MAX_MONITOR; i++) {
                normalizedCurve.push([time, lastElement[1]]);
                time += curvesConfiguration.STEPS_HEART;
            }
            for (let j = 0; j < dataset.length && time < curvesConfiguration.MAX_MONITOR; j++) {
                normalizedCurve.push([time, dataset[j][1]]);
                time += curvesConfiguration.STEPS_HEART;
            }
            for (let k = 0; k < constantPoints / 2 && time < curvesConfiguration.MAX_MONITOR; k++) {
                normalizedCurve.push([time, lastElement[1]]);
                time += curvesConfiguration.STEPS_HEART;
            }
        }
        return normalizedCurve;
    }


    /**
     * Normaliza el dataset a un tamaño particular de puntos
     * @param curves Curves to normalize
     * @returns {[number, number][]}
     */
    public normalizeDataset(dataset: [number, number][], value: number, source: PhysiologicalParameterSourceEnum): [number, number][] {
        if (!dataset.length) {
            return curvesConfiguration.CURVE_CONSTANT();
        }
        if (source === PhysiologicalParameterSourceEnum.Heart) {
            return this.normalizeHRCurve(dataset, value);
        }
        this.interpolatorService.setDataset(dataset)
        return this.normalizeRespirationCurve();
    }


    private normalizeRespirationCurve() {
        const normalizedCurve: [number, number][] = [];
        for (let i = 0; i < curvesConfiguration.TOTAL_POINTS; i++) {
            // Establece un nuevo step de acuerdo a la cantidad de puntos que se necesita para las curvas
            const xNorm = i / (curvesConfiguration.TOTAL_POINTS - 1);
            // Calcula el nuevo valor de y de acuerdo a la interpolación del nuevo valor de X
            const yNorm = this.interpolatorService.interpolateXValue(xNorm);
            normalizedCurve.push([xNorm, yNorm]);
        }

        return this.extendCurves(normalizedCurve);
    }

    public extendCurves(curves: [number, number][]): [number, number][] {
        const extendedCurves: [number, number][] = []
        if (curves.length)
            // Repite el ciclo de la curva original a lo largo del nuevo rango
            for (let x = 0; x < curvesConfiguration.MAX_MONITOR; x += curves[curves.length - 1][0]) {
                for (let i = 0; i < curves.length; i++) {
                    extendedCurves.push([x + curves[i][0], curves[i][1]])
                }
            }
        return extendedCurves;
    }


}
