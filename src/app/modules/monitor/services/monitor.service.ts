import { Injectable } from "@angular/core";
import { StatesI } from "@app/shared/models/stateI";
import { Observable, Subject } from "rxjs";

@Injectable()
export class MonitorService {
    private values: Subject<StatesI> = new Subject<StatesI>();
    private currentState: StatesI;

    /**
     * Get the last simulation status
     * @returns the last status
     */
    public getFirstState(): StatesI {
        const simulationState: StatesI = JSON.parse(
            localStorage.getItem("simulationState")
        );

        return simulationState;
    }

    /**
     * Check if the status has been changed and update the current state with the last status
     * @param simulationState
     * @returns
     */
    private getCurvesLocalStorage(simulationState: StatesI): boolean {
        try {
            const lastStatus: StatesI = JSON.parse(
                localStorage.getItem("simulationState")
            );
            if (simulationState) {
                if (simulationState.state != lastStatus?.state) {
                    this.currentState = lastStatus;
                    return true;
                } else return false;
                // if (!this.currentState) {
                //     this.currentState = simulationState;
                // } else {
                //     if (simulationState.state != this.currentState.state) {
                //         this.currentState = simulationState;
                //     }
                // }
            } else {
                this.currentState = lastStatus;
                return true;
            }
        } catch (error) {
            return false;
        }

    }

    /**
     * Get simulation info from subject (if the first state is different with the last state)
     * @param lastState
     * @returns
     */
    public getInfo(lastState: StatesI): Observable<StatesI> {
        if (this.getCurvesLocalStorage(lastState))
            this.values.next(this.currentState);
        return this.values.asObservable();
    }
}
