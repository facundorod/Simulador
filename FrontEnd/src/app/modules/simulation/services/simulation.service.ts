import { environment } from "@environments/environment";
import { ApiService } from "@app/shared/services/api.service";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class SimulationService {
    constructor(private api: ApiService) {}

    public list() {
        const subject = new Subject<any>();

        const endpoint = environment.api.simulations;

        this.api.httpGet(endpoint).subscribe(
            (simulations) => {
                console.log(simulations);
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
