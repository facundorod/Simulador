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
import { ParameterHelper } from '../helpers/parameterHelper';

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

    /**
      * Normaliza la curva de acuerdo a la frecuencia cardíaca
      * @param dataset
      * @param freqRate
      */
    private normalizeCurve(dataset: [number, number][], freqRate: number = 60): [number, number][] {
        const normalizedCurve = [];
        const lastElement = dataset[dataset.length - 1];
        const freqCurve: number = 60 / freqRate;
        let time: number = 0.0;
        const constantPoints: number = (curvesConfiguration.TOTAL_POINTS * freqCurve) - curvesConfiguration.CURVE_POINTS;
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
     * Normaliza el dataset unicamente de la figura de la curva a una cantidad fijada de puntos
     * @param dataset
     */
    private normalizeCurveDataset(dataset: [number, number][]): [number, number][] {
        const normalizedCurve: [number, number][] = [];
        this.interpolatorService.setDataset(dataset);
        for (let i = 0; i < curvesConfiguration.TOTAL_POINTS; i++) {
            // Establece un nuevo step de acuerdo a la cantidad de puntos que se necesita para las curvas
            const xNorm = i / (curvesConfiguration.TOTAL_POINTS - 1)
            // Calcula el nuevo valor de y de acuerdo a la interpolación del nuevo valor de X
            const yNorm = this.interpolatorService.interpolateXValue(xNorm)
            normalizedCurve.push([xNorm, yNorm])
        }
        return normalizedCurve;
    }

    /**
     * Normaliza el dataset para todo el intervalo del monitor
     * @param curves Curves to normalize
     * @returns {[number, number][]}
     */
    public normalizeDataset(dataset: [number, number][], value: number, source: PhysiologicalParameterSourceEnum): [number, number][] {
        if (!dataset.length) {
            return curvesConfiguration.CURVE_CONSTANT();
        }
        if (source === PhysiologicalParameterSourceEnum.Heart) {
            const normalizedCurveDataset: [number, number][] = this.normalizeCurveDataset(dataset);
            return this.normalizeCurve(normalizedCurveDataset, value);
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

    /**
    * Obtiene la frecuencia de sampleo necesaria por el monitor para que dibuje la curva
    * en un ciclo respiratorio determinado por el parámetro @param breathRate
    * @param breathRate current freq rate
    * @returns {number}
    */
    public static getBreathSamplingRate(breathRate: number): number {
        // Tiempo que tiene que tardar el monitor en dibujar una curva
        const drawCurveTime: number = 40 / breathRate;
        const heartSamplingRate: number = (drawCurveTime / curvesConfiguration.TOTAL_POINTS) * 1000;
        return heartSamplingRate;
    }

    public static updateIbpSystolic(curveDataset: [number, number][], previousValue: number, newValue: number): [number, number][] {
        return this.updateMaxY(curveDataset, previousValue, newValue);

    }

    public static updateIbpDiastolic(curveDataset: [number, number][], previousValue: number, newValue: number): [number, number][] {
        return this.updateMinY(curveDataset, previousValue, newValue);
    }

    public static updateInspirationCO2(curveDataset: [number, number][], previousValue: number, newValue: number): [number, number][] {
        return this.updateMinY(curveDataset, previousValue, newValue);
    }

    public static updateEndTidalCO2(curveDataset: [number, number][], previousValue: number, newValue: number): [number, number][] {
        return this.updateMaxY(curveDataset, previousValue, newValue);
    }

    private static updateMaxY(curveDataset: [number, number][], previousValue: number, newValue: number): [number, number][] {
        // Calcula el factor de escala para mantener la relación de aspecto
        const rFactor = newValue / previousValue;
        return curveDataset.map(point => [point[0], point[1] * rFactor]);
    }

    private static updateMinY(curveDataset: [number, number][], previousValue: number, newValue: number): [number, number][] {
        const currentMaxY: number = ParameterHelper.getMaxValue(curveDataset);
        // Calcula el factor de escala para mantener la relación de aspecto
        const rFactor = (currentMaxY - newValue) / (currentMaxY - previousValue);
        return curveDataset.map(point => [point[0], (point[1] - previousValue) * rFactor + newValue]);
    }


}
