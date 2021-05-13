import { Component, OnDestroy, OnInit, TrackByFunction } from "@angular/core";
import { CurvesService } from "@app/modules/control-panel/services/curves.service";
import { BaseComponent } from "@app/shared/components/base.component";
import { FormBuilder } from "@angular/forms";
import { AnimalSpeciesI } from "@app/shared/models/animal-speciesI";
import { MonitorService } from "../../services/monitor.service";
import { Subscription } from "rxjs";
import { CurvesI } from "@app/shared/models/curvesI";
import { StatesI } from "@app/shared/models/stateI";

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
    public samples: number = 4;
    chartOptions: any = {
        height: 200,
        width: 1100,
    };
    public curvePeriod: number = 1;
    public trackByFn: TrackByFunction<CurvesI> = (_, curve: CurvesI) => curve.curveConfiguration.id_pp;
    constructor(
        private curvesService: CurvesService,
        private monitorService: MonitorService
    ) {
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
        this.subscription = this.monitorService.getInfo(this.firstState).subscribe(
            (simulationState: StatesI) => {
                if (simulationState) {
                    this.curves = simulationState.curves;
                    this.animalSpecie = simulationState.animalSpecie;
                } else {
                    this.curves = null;
                    this.animalSpecie = null;
                }
            },
            (error: any) => {
                console.log(error);
            },
            () => {
                console.log("Simulación Terminada");
            }
        );
    }

    private checkLocalStorage(): void {
        this.firstState = this.monitorService.getFirstState();
        this.animalSpecie = this.firstState?.animalSpecie;
        this.curves = this.firstState?.curves;
        setInterval(() => {
            this.suscribeSimulationInfo();
        }, 300);
    }



}
