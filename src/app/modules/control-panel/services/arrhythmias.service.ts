import { ArrhythmiaI } from './../../../shared/models/arrhythmiaI';
import { Injectable } from '@angular/core';
import { ApiService } from '@app/shared/services/api.service';
import { HelperService } from '@app/shared/services/helper.service';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';

@Injectable()
export class ArrhythmiasService {
    constructor(private api: ApiService) {}

    /**
     * Return a list of arrhythmias
     * @param query
     * @param order
     */
    public list(query: any = null, order: any = null) {
        const subject = new Subject<any>();

        let endpoint = environment.api.arrhythmias;

        if (query) { endpoint += `?${HelperService.getQueryString(query)}`; }
        if (order) {
            const queryParams = HelperService.getOrderQueryString(order);
            if (endpoint.indexOf('?') >= 0) { endpoint += `&${queryParams}`; }
            else { endpoint += `?${queryParams}`; }
        }

        this.api.httpGet(endpoint).subscribe(
            (data: any) => {
                subject.next(data);
            },
            (err: any) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    /**
     * Find arrhythmia by id.
     * @param arrhythmiaId
     */
    public findById(arrhythmiaId: number) {
        const subject = new Subject<any>();

        const endpoint = environment.api.arrhythmias;

        this.api.httpGet(`${endpoint}/${arrhythmiaId}`).subscribe(
            (arrhythmias: any) => {
                subject.next(arrhythmias);
            },
            (err: any) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    /**
     * Create a new Arrhythmia
     * @param arrhythmia
     */
    public create(arrhythmia: ArrhythmiaI) {
        const subject = new Subject<any>();

        const endpoint = environment.api.arrhythmias;

        this.api.httpPost(endpoint, arrhythmia).subscribe(
            (arrhythmia: ArrhythmiaI) => {
                subject.next(arrhythmia);
            },
            (err: any) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public updateById(arrhythmiaId: number, arrhythmia: ArrhythmiaI) {
        const subject = new Subject<any>();

        const endpoint = environment.api.arrhythmias + arrhythmiaId;

        this.api.httpPut(endpoint, arrhythmia).subscribe(
            (arrhythmia: ArrhythmiaI) => {
                subject.next(arrhythmia);
            },
            (err: any) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );
        return subject.asObservable();
    }

    public delete(arrhythmiaId: number) {
        const subject = new Subject<any>();

        const endpoint = environment.api.arrhythmias + arrhythmiaId;

        this.api.httpDelete(endpoint).subscribe(
            (data: any) => {
                subject.next(data);
            },
            (err: any) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }
}
