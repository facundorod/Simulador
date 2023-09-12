import { Injectable } from '@angular/core';
import { MonitorStateI } from '@app/shared/models/MonitorStateI';
import { StatesI } from '@app/shared/models/stateI';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class MonitorService {
    private values: Subject<StatesI> = new Subject<StatesI>();
    private values2: Subject<MonitorStateI> = new Subject<MonitorStateI>();
    private currentState: StatesI;
    private currentMonitorState: MonitorStateI;

    constructor() {
        setInterval(() => {
            const lastStatus: StatesI = JSON.parse(
                localStorage.getItem('simulationState')
            );

            if (!this.currentState || this.isDiff(lastStatus)) {
                this.currentState = lastStatus;
                this.values.next(this.currentState);
            }
        }, 1000);

        setInterval(() => {
            const lastStatus: MonitorStateI = JSON.parse(localStorage.getItem('scenarioState'))
            if (!this.currentState) {
                this.currentMonitorState = lastStatus;
                this.values2.next(this.currentMonitorState);
            }
        })
    }

    /**
     * Get simulation info from subject (if the first state is different with the last state)
     * @param lastState
     * @returns
     */
    public getInfo(): Observable<StatesI> {
        return this.values.asObservable();
    }

    public getMonitorState(): Observable<MonitorStateI> {
        return this.values2.asObservable();
    }

    private isDiff(state: StatesI): boolean {
        return (
            (!state && this.currentState != null) ||
            state.state !== this.currentState.state ||
            state.action !== this.currentState.action ||
            state.muteAlarms !== this.currentState.muteAlarms
        );
    }
}
