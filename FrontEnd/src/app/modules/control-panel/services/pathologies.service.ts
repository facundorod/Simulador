import { PathologyI } from "./../../../shared/models/pathologyI";
import { ApiService } from "./../../../shared/services/api.service";
import { HelperService } from "@app/shared/services/helper.service";
import { environment } from "@environments/environment";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class PathologiesService {
    constructor(private api: ApiService) {}

    /**
     * Return a list of pathologies
     * @param query
     * @param order
     */
    public list(query: any = null, order: any = null) {
        const subject = new Subject<any>();

        let endpoint = environment.api.pathologies;

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
     * Find pathology by id.
     * @param pathologyId
     */
    public findById(pathologyId: number) {
        const subject = new Subject<any>();

        let endpoint = environment.api.pathologies;

        this.api.httpGet(`${endpoint}/${pathologyId}`).subscribe(
            (pathologies: any) => {
                subject.next(pathologies);
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
     * Create a new Pathology
     * @param pathology
     */
    public create(pathology: PathologyI) {
        const subject = new Subject<any>();

        let endpoint = environment.api.pathologies;

        this.api.httpPost(endpoint, pathology).subscribe(
            (pathology: PathologyI) => {
                subject.next(pathology);
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

    public updateById(pathologyId: number, pathology: PathologyI) {
        const subject = new Subject<any>();

        let endpoint = environment.api.pathologies + pathologyId;

        this.api.httpPut(endpoint, pathology).subscribe(
            (pathology: PathologyI) => {
                subject.next(pathology);
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

    public delete(pathologyId: number) {
        const subject = new Subject<any>();

        let endpoint = environment.api.pathologies + pathologyId;

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
