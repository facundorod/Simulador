import { Injectable } from "@angular/core";
import { ApiService } from "@app/shared/services/api.service";
import { HelperService } from "@app/shared/services/helper.service";
import { environment } from "@environments/environment";
import { Observable, Subject } from "rxjs";

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

        if (query) endpoint += `?${HelperService.getQueryString(query)}`;

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

        let endpoint = environment.api.curves + 'shift';


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

        let endpoint = environment.api.curves + 'normalize';


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

        let endpoint = environment.api.curves + 'amplitude';


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
}
