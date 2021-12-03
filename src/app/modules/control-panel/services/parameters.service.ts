import { Injectable } from "@angular/core";
import { PhysiologicalParamaterI } from "@app/shared/models/physiologicalParamaterI";
import { SPPI } from "@app/shared/models/SPPI";
import { ApiService } from "@app/shared/services/api.service";
import { HelperService } from "@app/shared/services/helper.service";
import { environment } from "@environments/environment";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ParametersService {
    private baseUrl: string = environment.api.parameters;

    constructor(private api: ApiService) {}

    public findAll(query: any = null): Observable<PhysiologicalParamaterI[]> {
        const subject = new Subject<PhysiologicalParamaterI[]>();
        let endpoint = this.baseUrl;
        if (query) endpoint += `?${HelperService.getQueryString(query)}`;

        this.api.httpGet(endpoint).subscribe(
            (data: PhysiologicalParamaterI[]) => {
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

    public updateParameter(
        parameterId: number,
        parameterData: PhysiologicalParamaterI
    ): Observable<void> {
        const subject = new Subject<void>();
        this.api
            .httpPut(`${this.baseUrl}/${parameterId}`, parameterData)
            .subscribe(
                () => {
                    subject.next();
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

    public createParameter(
        parameter: PhysiologicalParamaterI
    ): Observable<void> {
        const subject = new Subject<void>();
        this.api.httpPost(`${this.baseUrl}`, parameter).subscribe(
            () => {
                subject.next();
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
