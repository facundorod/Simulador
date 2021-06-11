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
        const lastStatus: StatesI = JSON.parse(
            localStorage.getItem("simulationState")
        );

        if (simulationState) {
            if (!this.currentState) {
                this.currentState = simulationState;
                return true;
            } else {
                if (simulationState.state != this.currentState.state) {
                    this.currentState = simulationState;
                    return true;
                }
            }
        } else {
            this.currentState = lastStatus;
            return true;
        }
        return false;
    }

    /**
     * Get simulation info from subject (if the first state is different with the last state)
     * @param firstState
     * @returns
     */
    public getInfo(firstState: StatesI): Observable<StatesI> {
        if (this.getCurvesLocalStorage(firstState)) {
            this.values.next(this.currentState);
        }
        return this.values.asObservable();
    }
}
