import { Injectable } from '@angular/core';
import { StatesI } from '@app/shared/models/stateI';
import { ApiService } from '@app/shared/services/api.service';
import { HelperService } from '@app/shared/services/helper.service';
import { environment } from '@environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CurvesService {
    constructor(private api: ApiService) { }

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
}
