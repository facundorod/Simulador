import { Injectable } from '@angular/core';
import { curvesConfiguration } from '@app/shared/constants/curves';
import { ApiService } from '@app/shared/services/api.service';
import { HelperService } from '@app/shared/services/helper.service';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { InterpolatorService } from './interpolator.service';
import { PhysiologicalParameterSourceEnum } from '@app/shared/enum/physiologicalParameterSourceEnum';
import { ParameterHelper } from '../helpers/parameterHelper';
import { CurvesHelper } from '@app/modules/simulation/helpers/curvesHelper';

@Injectable()
export class CurvesService {
    private interpolatorService: InterpolatorService;
    private curvesHelper: CurvesHelper;

    constructor(private api: ApiService) {
        this.interpolatorService = new InterpolatorService();
        this.curvesHelper = new CurvesHelper();
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
    public normalizeCurve(dataset: [number, number][], freqRate: number = 60): [number, number][] {
        const normalizedCurve = [];
        const lastElement = dataset[dataset.length - 1];
        let time: number = 0.0;
        const constantPoints: number = curvesConfiguration.TOTAL_POINTS - curvesConfiguration.CURVE_POINTS;
        const scale = 60 / freqRate;

        const stepsHeart = scale / curvesConfiguration.TOTAL_POINTS;
        while (time < curvesConfiguration.MAX_MONITOR) {
            for (let i = 0; i < constantPoints / 2; i++) {
                normalizedCurve.push([time, lastElement[1]]);
                time += stepsHeart;
            }
            for (const element of dataset) {
                normalizedCurve.push([time, element[1]]);
                time += stepsHeart;
            }
            for (let k = 0; k < constantPoints / 2; k++) {
                normalizedCurve.push([time, lastElement[1]]);
                time += stepsHeart;
            }
        }


        return normalizedCurve;
    }

    public normalizeByHr(dataset: [number, number][], heartRate: number): [number, number][] {
        let x = 0;
        const normalizedDataset: [number, number][] = []
        const steps = (60 / heartRate) / curvesConfiguration.TOTAL_POINTS;
        while (x < curvesConfiguration.MAX_MONITOR)
            for (const element of dataset) {
                normalizedDataset.push([x, element[1]]);
                x += steps;
            }
        return normalizedDataset;
    }


    /**
     * Normaliza el dataset unicamente de la figura de la curva a una cantidad fijada de puntos
     * @param dataset
     */
    public normalizeCurveDataset(dataset: [number, number][]): [number, number][] {
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
            return this.normalizeByHr(dataset, value);
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
                for (const element of curves) {
                    extendedCurves.push([x + element[0], element[1]])
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
        const drawCurveTime: number = 30 / breathRate;
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

    public static updateMaxY(curveDataset: [number, number][], previousValue: number, newValue: number, factor?: number): [number, number][] {
        // Calcula el factor de escala para mantener la relación de aspecto
        let rFactor = factor || newValue / previousValue;
        return curveDataset.map(point => [point[0], point[1] * rFactor]);
    }

    private static updateMinY(curveDataset: [number, number][], previousValue: number, newValue: number): [number, number][] {
        const currentMaxY: number = ParameterHelper.getMaxValue(curveDataset);
        // Calcula el factor de escala para mantener la relación de aspecto
        const rFactor = (currentMaxY - newValue) / (currentMaxY - previousValue);
        return curveDataset.map(point => [point[0], (point[1] - previousValue) * rFactor + newValue]);
    }


}
