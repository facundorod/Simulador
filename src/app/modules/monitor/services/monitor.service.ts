import { Injectable } from "@angular/core";
import { StatesI } from "@app/shared/models/stateI";
import { Observable, Subject } from "rxjs";

@Injectable()
export class MonitorService {
    private values: Subject<StatesI> = new Subject<StatesI>();
    private currentState: StatesI;

    constructor() {
        setInterval(() => {
            const lastStatus: StatesI = JSON.parse(localStorage.getItem("simulationState"));
            if (!lastStatus) return;
            if (!this.currentState || this.isDiff(lastStatus)) {
                this.currentState = lastStatus;
                this.values.next(this.currentState);
            }
        }, 500)
    }

    /**
     * Get simulation info from subject (if the first state is different with the last state)
     * @param lastState
     * @returns
     */
    public getInfo(): Observable<StatesI> {
        return this.values.asObservable();
    }

    private isDiff(state: StatesI): boolean {
        return (state.state !== this.currentState.state || state.action !== this.currentState.action);
    }
}
