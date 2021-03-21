import { MedicationI } from "@models/medicationI";
import { Injectable } from "@angular/core";
import { ApiService } from "@app/shared/services/api.service";
import { HelperService } from "@app/shared/services/helper.service";
import { environment } from "@environments/environment";
import { Subject } from "rxjs";

@Injectable()
export class MedicationsService {
    constructor(private api: ApiService) {}

    /**
     * Return a list of medications
     * @param query
     * @param order
     */
    public list(query: any = null, order: any = null) {
        const subject = new Subject<any>();

        let endpoint = environment.api.medications;

        if (query) endpoint += `?${HelperService.getQueryString(query)}`;
        if (order) {
            const queryParams = HelperService.getOrderQueryString(order);
            if (endpoint.indexOf("?") >= 0) endpoint += `&${queryParams}`;
            else endpoint += `?${queryParams}`;
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
     * Find medication by id.
     * @param medicationId
     */
    public findById(medicationId: number) {
        const subject = new Subject<any>();

        let endpoint = environment.api.medications;

        this.api.httpGet(`${endpoint}/${medicationId}`).subscribe(
            (medications: any) => {
                subject.next(medications);
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
     * Create a new medication
     * @param medication
     */
    public create(medication: MedicationI) {
        const subject = new Subject<any>();

        let endpoint = environment.api.medications;

        this.api.httpPost(endpoint, medication).subscribe(
            (medication: MedicationI) => {
                subject.next(medication);
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

    public updateById(medicationId: number, medication: MedicationI) {
        const subject = new Subject<any>();

        let endpoint = environment.api.medications + medicationId;

        this.api.httpPut(endpoint, medication).subscribe(
            (medication: MedicationI) => {
                subject.next(medication);
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

    public delete(medicationId: number) {
        const subject = new Subject<any>();

        let endpoint = environment.api.medications + medicationId;

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
