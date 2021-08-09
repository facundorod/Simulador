import { Component, HostListener, OnChanges, OnDestroy, OnInit, SimpleChanges, TrackByFunction } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base.component";
import { AnimalSpeciesI } from "@app/shared/models/animal-speciesI";
import { MonitorService } from "../../services/monitor.service";
import { Subscription } from "rxjs";
import { CurvesI } from "@app/shared/models/curvesI";
import { StatesI } from "@app/shared/models/stateI";
import { Monitor } from "@app/shared/models/monitor";

@Component({
    selector: "app-monitor",
    templateUrl: "./monitor.component.html",
    styleUrls: ["./monitor.component.css"],
})
export class MonitorComponent
    extends BaseComponent
    implements OnInit, OnDestroy {
    public curves: StatesI;
    public animalSpecie: AnimalSpeciesI;
    public today: Date = new Date();
    private subscription: Subscription;
    public lastState: StatesI;
    public maxSamples: number = 4;
    public stopCurves: StatesI | any = {};
    public monitorConfiguration: Monitor = new Monitor();

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
     * Check localstorage every 300 ms.
     */
    private checkLocalStorage(): void {
        // Create the conection with the monitor service
        this.monitorService.getInfo().subscribe(
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
            this.curves = simulationState;
            this.updateStopCurves();
            this.lastState = simulationState;
            this.animalSpecie = simulationState.animalSpecie;
        }

    }


    private updateStopCurves(): void {
        this.stopCurves.curves = [];
        this.curves.curves.forEach((value: CurvesI) => {
            const dataValues: [number, number][] = [];
            dataValues.splice(0, 1);
            for (let i: number = 0.0; i <= 1.0; i += 0.05) {
                dataValues.push([Math.round(i * 100) / 100, 1]);
            }
            const newValue: CurvesI = {
                animalSpecie: value.animalSpecie,
                curveConfiguration: value.curveConfiguration,
                curveValues: dataValues
            }
            this.stopCurves.curves.push(newValue);
        })
    }


}


