import { ScenarioI } from "@models/scenarioI";
import { ApiService } from "../../../shared/services/api.service";
import { HelperService } from "@app/shared/services/helper.service";
import { environment } from "@environments/environment";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class ScenarioService {
    constructor(private api: ApiService) {}

    /**
     * Return a list of scenarios
     * @param query
     * @param order
     */
    public list(query: any = null, order: any) {
        const subject = new Subject<any>();

        let endpoint = environment.api.scenarios;

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
     * Find scenario by id.
     * @param scenarioId
     */
    public findById(scenarioId: number) {
        const subject = new Subject<any>();

        let endpoint = environment.api.scenarios;

        this.api.httpGet(`${endpoint}/${scenarioId}`).subscribe(
            (scenarios: any) => {
                subject.next(scenarios);
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
     * Create a new Scenario
     * @param scenario
     */
    public create(scenario: ScenarioI) {
        const subject = new Subject<any>();

        let endpoint = environment.api.scenarios;

        this.api.httpPost(endpoint, scenario).subscribe(
            (scenario: ScenarioI) => {
                subject.next(scenario);
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

    public updateById(scenarioId: number, scenario: ScenarioI) {
        const subject = new Subject<any>();

        let endpoint = environment.api.scenarios + scenarioId;

        this.api.httpPut(endpoint, scenario).subscribe(
            (scenario: ScenarioI) => {
                subject.next(scenario);
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

    public delete(scenarioId: number) {
        const subject = new Subject<any>();

        let endpoint = environment.api.scenarios + scenarioId;

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
