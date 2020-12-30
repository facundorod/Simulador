import { ApiService } from "./../../../shared/services/api.service";
import { HelperService } from "@app/shared/services/helper.service";
import { environment } from "@environments/environment";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AnimalSpeciesService {
    constructor(private api: ApiService) {}

    /**
     * Return a list of animalSpecies
     * @param query
     * @param order
     */
    public list(query: any, order: any) {
        const subject = new Subject<any>();

        let endpoint = environment.api.animalSpecies;

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
}
