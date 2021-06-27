import { Component, OnDestroy, OnInit, TrackByFunction } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base.component";
import { AnimalSpeciesI } from "@app/shared/models/animal-speciesI";
import { MonitorService } from "../../services/monitor.service";
import { Subscription } from "rxjs";
import { CurvesI } from "@app/shared/models/curvesI";
import { StatesI } from "@app/shared/models/stateI";
import { CurvesHelper } from "@app/modules/simulation/helpers/curvesHelper";

@Component({
    selector: "app-monitor",
    templateUrl: "./monitor.component.html",
    styleUrls: ["./monitor.component.css"],
})
export class MonitorComponent
    extends BaseComponent
    implements OnInit, OnDestroy {
    public curves: CurvesI[];
    public animalSpecie: AnimalSpeciesI;
    public today: Date = new Date();
    private subscription: Subscription;
    public lastState: StatesI;
    private period: number = 1;
    public maxSamples: number = 4;
    private curvesHelper: CurvesHelper = new CurvesHelper();
    public stopCurves: CurvesI[] = [];

    private simulationTimer: NodeJS.Timeout;
    public trackByFn: TrackByFunction<CurvesI> = (_, curve: CurvesI) => curve.curveConfiguration.id_pp;
    constructor(private monitorService: MonitorService) {
        super();
    }

    ngOnInit(): void {
        this.checkLocalStorage();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        clearInterval(this.simulationTimer);
    }

    /**
     * Subscribe to simulation info.
     */
    private suscribeSimulationInfo(): void {
        // Create the conection with the monitor service
        this.monitorService.getInfo(this.lastState).subscribe(
            (simulationState: StatesI) => {
                if (simulationState) {
                    this.updateCurves(simulationState);
                } else {
                    this.curves = null;
                    this.lastState = null;
                    this.animalSpecie = null;
                }
            },
            (error: Error) => {
                console.log(error);
            },
            () => {
                console.log("Simulation finished!");
            }
        );
    }

    /**
     * Check localstorage every 300 ms.
     */
    private checkLocalStorage(): void {

        this.simulationTimer = setInterval(() => {
            this.suscribeSimulationInfo();
        }, 500);
    }

    /**
     * If the simulation for the local storage (@param simulationState) is different to current state (@param currentState)
     * return true, else return false.
     * @param simulationState
     * @param currentState
     * @returns true or false
     */
    public isSameState(simulationState: StatesI, currentState: StatesI): boolean {
        if (!currentState) return false;
        return (simulationState.state === currentState?.state) && (simulationState?.action === currentState?.action);
    }


    private updateCurves(simulationState: StatesI): void {
        if (!this.isSameState(simulationState, this.lastState)) {
            this.curves = simulationState.curves;
            this.updateStopCurves();
            this.scaleCurves();
            this.lastState = simulationState;
            this.animalSpecie = simulationState.animalSpecie;
        }

    }

    private scaleCurves(): void {
        this.curves.forEach((value: CurvesI) => {
            this.curvesHelper.reSampleCurve(value.curveValues, this.period, this.maxSamples);
        })
    }

    private updateStopCurves(): void {
        this.stopCurves = [];
        this.curves.forEach((value: CurvesI) => {
            const dataValues: number[][] = [[]];
            dataValues.splice(0, 1);
            for (let i: number = 0.0; i <= this.maxSamples; i += 0.1) {
                dataValues.push([i, 1]);
            }
            const newValue: CurvesI = {
                animalSpecie: value.animalSpecie,
                curveConfiguration: value.curveConfiguration,
                curveValues: dataValues
            }
            this.stopCurves.push(newValue);
        })
    }


}


