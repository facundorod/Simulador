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
    private firstState: StatesI;
    public currentState: StatesI;
    private period: number = 1;
    public maxSamples: number = 4;
    private curvesHelper: CurvesHelper = new CurvesHelper();
    public chartOptions: NgxEchartsDirective["initOpts"] = {
        height: 200,
        width: 1180,
    };

    public trackByFn: TrackByFunction<CurvesI> = (_, curve: CurvesI) => curve.curveConfiguration.id_pp;
    constructor(private monitorService: MonitorService) {
        super();
        this.checkLocalStorage();

    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * Subscribe to simulation info.
     */
    private suscribeSimulationInfo() {
        // Create the conection with the monitor service
        this.monitorService.getInfo(this.firstState).subscribe(
            (simulationState: StatesI) => {
                if (simulationState) {
                    this.updateCurves(simulationState);
                } else {
                    this.curves = null;
                    this.currentState = null;
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
        this.firstState = this.monitorService.getFirstState();
        this.animalSpecie = this.firstState?.animalSpecie;
        if (this.firstState?.curves) {
            this.curves = this.firstState.curves;
            this.scaleCurves();
        }
        setInterval(() => {
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
        return (simulationState.state === currentState?.state) && (simulationState?.action === currentState?.action);
    }


    private updateCurves(simulationState: StatesI): void {
        if (!this.isSameState(simulationState, this.currentState)) {
            this.curves = simulationState.curves;
            this.scaleCurves();
            this.currentState = simulationState;
            this.animalSpecie = simulationState.animalSpecie;
        }
    }

    private scaleCurves(): void {
        this.curves.forEach((value: CurvesI) => {
            this.curvesHelper.reSampleCurve(value.curveValues, this.period, this.maxSamples);
        })

        console.log("THIS CURVES", this.curves);
    }
}


