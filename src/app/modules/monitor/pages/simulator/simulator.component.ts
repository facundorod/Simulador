import { Component, OnDestroy, OnInit, TrackByFunction } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base.component";
import { AnimalSpeciesI } from "@app/shared/models/animal-speciesI";
import { MonitorService } from "../../services/monitor.service";
import { Subscription } from "rxjs";
import { CurvesI } from "@app/shared/models/curvesI";
import { StatesI } from "@app/shared/models/stateI";
import { NgxEchartsDirective } from "ngx-echarts";
import { CurvesHelper } from "@app/modules/simulation/helpers/curvesHelper";

@Component({
    selector: "app-simulator",
    templateUrl: "./simulator.component.html",
    styleUrls: ["./simulator.component.css"],
})
export class SimulatorComponent
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
    public chartOptions: NgxEchartsDirective["initOpts"] = {
        height: 180,
        width: 1180,
    };

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
        }, 300);
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
            this.scaleCurves();
            // this.currentState = simulationState;
            this.lastState = simulationState;
            this.animalSpecie = simulationState.animalSpecie;
        }
    }

    private scaleCurves(): void {
        this.curves.forEach((value: CurvesI) => {
            this.curvesHelper.reSampleCurve(value.curveValues, this.period, this.maxSamples);
        })
    }

    /**
     * Get the max value on y-axis
     * @param curveValues
     * @returns max value for curveValues
     */
    public getMaxY(curveValues: number[][]): number {
        let maxY: number = curveValues[0][1];
        for (let curve of curveValues) {
            if (curve[1] > maxY)
                maxY = curve[1];
        }
        return maxY;
    }

    /**
     * Get the min value on y-axis
     * @param curveValues
     * @returns min value for curveValues
     */
    public getMinY(curveValues: number[][]): number {
        let minY: number = curveValues[0][1];
        for (let curve of curveValues) {
            if (curve[1] < minY)
                minY = curve[1];
        }
        return minY;
    }

    /**
     * Create a constant curve when the simulation is stopped
     * @returns Constant curve to show when the simulation is stopped
     */
    public onStopCurve(curveValues: number[][]): number[][] {
        let curveAux: number[][] = [];
        curveValues.forEach(() => {
            curveAux.push([1, 1]);
        });
        return curveAux;
    }
}


