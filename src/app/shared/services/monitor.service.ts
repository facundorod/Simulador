import { Injectable } from "@angular/core";
import { MonitorI } from "../models/monitorI";
import { ApiService } from "./api.service";
import { environment } from "@environments/environment";
import { Observable, Subject } from "rxjs";

@Injectable()
export class MonitorConfigurationService {
    constructor(private api: ApiService) {}

    public getMonitorConfiguration(): Promise<MonitorI> {
        const endpoint: string = environment.api.simulations + "monitor";
        const value: Promise<MonitorI> = this.api.httpGet(endpoint).toPromise();

        return value;
    }

    public updateMonitorConfiguration(monitor: MonitorI): Observable<void> {
        const subject = new Subject<void>();

        const endpoint: string = environment.api.simulations + "monitor";
        this.api.httpPut(endpoint, monitor).subscribe(
            () => {
                subject.next();
            },
            (error: Error) => {
                console.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }
}
