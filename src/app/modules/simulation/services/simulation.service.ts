import { environment } from '@environments/environment';
import { ApiService } from '@app/shared/services/api.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class SimulationService {
    constructor(private api: ApiService) {}

    public list() {
        const subject = new Subject<any>();

        const endpoint = environment.api.simulations;

        this.api.httpGet(endpoint).subscribe(
            (simulations) => {
                subject.next(simulations);
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

    public create(simulationData: any) {
        const subject = new Subject<any>();

        const endpoint = environment.api.simulations;

        this.api.httpPost(endpoint, simulationData).subscribe(
            (simulation) => {
                subject.next(simulation);
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

    public updateById(id: number, simulationData: any) {
        const subject = new Subject<any>();

        const endpoint = environment.api.simulations + id;

        this.api.httpPut(endpoint, simulationData).subscribe(
            (simulation) => {
                subject.next(simulation);
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

    public getSimulationsByScenario(id: number) {
        const subject = new Subject<any>();

        const endpoint = environment.api.simulations + `scenarios/` + id;

        this.api.httpGet(endpoint).subscribe(
            (simulations: any) => {
                subject.next(simulations);
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
