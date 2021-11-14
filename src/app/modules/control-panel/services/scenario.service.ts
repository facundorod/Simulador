import { ScenarioI } from "@models/scenarioI";
import { ApiService } from "../../../shared/services/api.service";
import { HelperService } from "@app/shared/services/helper.service";
import { environment } from "@environments/environment";
import { Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { ScenarioParamsI } from "@app/shared/models/scenarioParamsI";

@Injectable()
export class ScenarioService {
    constructor(private api: ApiService) {}

    /**
     * Return a list of scenarios
     * @param query
     * @param order
     */
    public list(query: any = null, order: any = null) {
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

    public listWithParams(query: any = null, order: any = null) {
        const subject = new Subject<any>();

        let endpoint = environment.api.scenariosParams;

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

    public listByIdWithParams(scenarioId: number): Observable<ScenarioParamsI> {
        const subject = new Subject<ScenarioParamsI>();

        let endpoint = environment.api.scenariosParams + "/" + scenarioId;

        this.api.httpGet(endpoint).subscribe(
            (data: any) => {
                if (data && data.data) subject.next(data.data);
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
            (scenario) => {
                subject.next([scenario]);
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

    public updateById(scenarioId: number, scenario: any) {
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

    public savePathologies(pathologies: any[], id_scenario: number) {
        const subject = new Subject<any>();

        let endpoint = environment.api.scenarios + `pathologies`;

        this.api.httpPost(endpoint, { id_scenario, pathologies }).subscribe(
            (data: any) => {
                subject.next(data);
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

    public saveMedications(medications: any[], id_scenario: number) {
        const subject = new Subject<any>();

        let endpoint = environment.api.scenarios + `medications`;

        this.api.httpPost(endpoint, { id_scenario, medications }).subscribe(
            (data: any) => {
                subject.next(data);
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

    public saveArrhythmias(arrhythmias: any[], id_scenario: number) {
        const subject = new Subject<any>();

        let endpoint = environment.api.scenarios + `arrhythmias`;

        this.api
            .httpPost(endpoint, {
                id_scenario,
                arrhythmias,
            })
            .subscribe(
                (data: any) => {
                    subject.next(data);
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
}
