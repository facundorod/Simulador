import { SimulationService } from "./../../../simulation/services/simulation.service";
import { ToastrService } from "ngx-toastr";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";

// Service
import { AnimalSpeciesService } from "./../../services/animalSpecies.service";

// Models
import { PathologyI } from "@models/pathologyI";
import { MedicationI } from "@models/medicationI";
import { ArrhythmiaI } from "@models/arrhythmiaI";
import { AnimalSpeciesI } from "@models/animal-speciesI";
import { BaseComponent } from "@app/shared/components/base.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CurvesService } from "../../services/curves.service";
import { CurvesI } from "@app/shared/models/curvesI";
import { CurvesHelper } from "./../../../simulation/helpers/curvesHelper";
import { LocalStorageService } from "@app/shared/services/localStorage.service";
import { MonitorService } from "@app/modules/monitor/services/monitor.service";
import { StatesI } from "@app/shared/models/stateI";
import { environment } from "@environments/environment";
import { PhysiologicalParamaterI } from "@app/shared/models/physiologicalParamaterI";
import { Monitor } from "@app/shared/models/monitor";
import { ParameterInfoI } from "@app/shared/models/parameterInfoI";

@Component({
    selector: "app-panel",
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.css"],
})
export class PanelComponent extends BaseComponent implements OnInit, OnDestroy {
    private activeScenario: any; // Scenario active for simulation

    public scenariosSimulation: any[] = [];
    public animalSpecies: any[] = []; // Animal Species to populate the dropdown
    public animalSpecie: any = {}; // Animal Specie from simulation
    public simulation: any = {}; // Simulation from localStorage
    public indexActive: number = 0; // Index for scenario edit Active
    public indexSimulationActive: number = 0; // Index for scenario simulation Active
    public currentState: StatesI; // Curves for scenario and animalSpecie selected
    private curvesHelper = new CurvesHelper();
    // Paramaters Physiological without curves
    public fromGroupParameters: FormGroup;
    public heartRate: number;
    public breathRate: number;
    public temperature: number;
    public spo2: number;
    public monitorConfiguration: Monitor = new Monitor();


    constructor(
        private animalSpecieService: AnimalSpeciesService,
        private fb: FormBuilder,
        private toast: ToastrService,
        private simulationService: SimulationService,
        private curvesService: CurvesService,
        private localStorageService: LocalStorageService,
    ) {
        super();
        // window.open(environment.simulation, "_blank");
    }

    ngOnInit(): void {
        this.setSubmitForm(false);
        this.setLoading(true);
        this.loadData();
        this.initFormGroup();
        this.onLoadCurves(this.formGroup.value.animalSpecie);
    }

    ngOnDestroy(): void {
        this.localStorageService.removeValue("simulationState");
    }

    /**
     * Load all data necesary for forms
     */
    private loadData() {
        this.simulation = JSON.parse(localStorage.getItem("Simulation"));

        this.animalSpecieService.list().subscribe(
            (animalSpecies: any) => {
                this.animalSpecies = animalSpecies.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

        // Create new simulation
        if (!this.simulation) {
            this.animalSpecieService.list().subscribe(
                (animalSpecies) => {
                    this.setLoading(false);
                    this.animalSpecies = animalSpecies.data;
                },
                (error: any) => {
                    console.log(error);
                }
            );
        }
        // Edit simulation
        else {
            if (this.simulation.scenarios) {
                this.scenariosSimulation = this.simulation.scenarios;
                // If the simulation has scenarios, the first will be the active for simulation
                this.activeScenario = this.scenariosSimulation[0];
            }

            if (this.simulation.animalSpecie)
                this.animalSpecie = this.simulation.animalSpecie;
        }
    }

    /**
     * Initialize the reactive form
     */
    private initFormGroup(): void {
        this.formGroup = this.fb.group({
            simulationName: [
                this.simulation ? this.simulation.name : "",
                Validators.required,
            ],
            simulationDescription: [
                this.simulation ? this.simulation.description : "",
                Validators.required,
            ],
            animalSpecie: [
                this.animalSpecie ? this.animalSpecie : "",
                Validators.required,
            ]
        });
        this.fromGroupParameters = this.fb.group({
            heartRate: [
                this.heartRate ? this.heartRate : 0
            ],
            breathRate: [
                this.breathRate ? this.breathRate : 0
            ],
            temperature: [
                this.temperature ? this.temperature : 0
            ]
        })
        this.onValueChanges();
    }

    /**
     * Save scenario and simulations according to form data
     */
    public onSaveChanges() {
        this.submitForm = true;
        this.saveSimulation();
    }

    /**
     * Change detection for each input
     */
    private onValueChanges(): void {
        this.formGroup.get("animalSpecie").valueChanges.subscribe((val) => {
            this.onLoadCurves(val);

            this.updateState();
        });
        this.fromGroupParameters.get("heartRate").valueChanges.subscribe((val) => {
            // this.curvesHelper.scaleCurves(this.currentState.curves, val, 0);
            this.heartRate = val;
            this.saveParameterInfo();
            this.updateState();
        });
        this.fromGroupParameters.get("breathRate").valueChanges.subscribe((val) => {
            // this.curvesHelper.scaleCurves(this.currentState.curves, 0, val);
            this.breathRate = val;
            this.saveParameterInfo();
            this.updateState();
        });

    }

    /**
     * Load curves for scenario active for simulation and animalSpecie selected
     */
    public onLoadCurves(as: AnimalSpeciesI) {
        if (this.activeScenario?.id_scenario && as?.id_as) {
            this.curvesService
                .findAll({
                    animalSpecie: as.id_as,
                    scenario: this.activeScenario.id_scenario,
                })
                .subscribe(
                    (state: StatesI) => {
                        if (state) {
                            this.currentState = state;
                            this.onLoadParameters();
                            this.localStorageService.saveValue("simulationState", JSON.stringify(this.currentState));
                        } else {
                            this.currentState = null;
                            this.localStorageService.removeValue("simulationState");
                        }
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
        } else {
            this.currentState = null;
            this.localStorageService.removeValue("simulationState");
        }
    }

    /**
     * Load parameters without curves
     * @param state
     */
    private onLoadParameters(): void {
        this.currentState.curves = this.currentState.curves.filter((value: CurvesI) => {
            switch (value.curveConfiguration.label.toUpperCase()) {
                case 'RESP':
                    this.breathRate = value.curveConfiguration.refValue;
                    break;
                case 'CAR':
                    this.heartRate = value.curveConfiguration.refValue;
                    break;
                case 'TEMP':
                    this.temperature = value.curveConfiguration.refValue;
                    break;
                case 'SPO2':
                    this.spo2 = value.curveConfiguration.refValue;
                    return value;
                default:
                    return value;
            }
        })
        this.saveParameterInfo();
    }

    private saveParameterInfo(): void {
        const parameterInfo: ParameterInfoI = {
            temperature: this.temperature,
            heartRate: this.heartRate,
            breathRate: this.breathRate,
            spO2: this.spo2
        }
        this.localStorageService.saveValue('parameterState', JSON.stringify(parameterInfo));
    }


    /**
     * Save simulation
     */
    private saveSimulation(): void {
        const simulationData = {
            name: this.formGroup.value.simulationName,
            description: this.formGroup.value.simulationDescription,
            animalSpecie: {
                id_as: this.formGroup.value.animalSpecie.id_as,
                name: this.formGroup.value.animalSpecie.name,
                description: this.formGroup.value.animalSpecie.description,
            },
            scenarios: this.scenariosSimulation,
        };

        // Create simulation
        if (!this.simulation) {
            this.simulationService.create(simulationData).subscribe(
                (data: any) => {
                    this.toast.toastrConfig.timeOut = 1000;
                    this.toast.toastrConfig.positionClass = "toast-bottom-left";
                    this.toast.toastrConfig.closeButton = true;
                    this.toast.success("Simulation saved!");
                    this.simulation = simulationData;
                    this.simulation.id_simulation = data.id_simulation;
                },
                (error: any) => {
                    this.toast.toastrConfig.timeOut = 1000;
                    this.toast.toastrConfig.positionClass = "toast-bottom-left";
                    this.toast.toastrConfig.closeButton = true;
                    this.toast.error("Error saving simulation");
                }
            );
        } else {
            // Edit simulation
            this.simulationService
                .updateById(this.simulation.id_simulation, simulationData)
                .subscribe(
                    () => {
                        this.toast.toastrConfig.timeOut = 1000;
                        this.toast.toastrConfig.positionClass =
                            "toast-bottom-left";
                        this.toast.toastrConfig.closeButton = true;
                        this.toast.success("Simulation saved!");
                    },
                    (error: any) => {
                        this.toast.toastrConfig.timeOut = 1000;
                        this.toast.toastrConfig.positionClass =
                            "toast-bottom-left";
                        this.toast.toastrConfig.closeButton = true;
                        this.toast.error("Error saving simulation");
                    }
                );
        }
    }

    public getScenarios(scenarios: any): void {
        this.scenariosSimulation = scenarios;
        this.activeScenario = this.scenariosSimulation[
            this.indexSimulationActive
        ];
        this.currentState = null;
        this.onLoadCurves(this.formGroup.value.animalSpecie);
    }

    public getPosScenarios(pos: any): void {
        this.indexActive = pos.indexEdit;
        this.indexSimulationActive = pos.indexActive;
    }


    public onPlaySimulation(): void {
        if (this.currentState)
            this.currentState.action = 'play';
        this.localStorageService.saveValue(
            "simulationState",
            JSON.stringify(this.currentState)
        );
    }

    public onPauseSimulation(): void {
        if (this.currentState)
            this.currentState.action = 'pause';
        this.localStorageService.saveValue(
            "simulationState",
            JSON.stringify(this.currentState)
        );
    }

    public onStopSimulation(): void {
        if (this.currentState) this.currentState.action = 'stop';
        this.localStorageService.saveValue("simulationState", JSON.stringify(this.currentState));
    }

    private updateState(): void {
        if (this.currentState) {
            this.currentState.state++;
            this.localStorageService.saveValue("simulationState", JSON.stringify(this.currentState));
        }
    }

    /**
     *  TrackByFn: Define como rastrear los cambios en los ítems utilizados en el *ngFor.
     *  Aumenta el rendimiento, ya que solo se vuelven a representar en el DOM los nodos
     *  que han sido actualizados.
     */
    public trackByFnAnimalSpecies(index: number, name: AnimalSpeciesI): number {
        return name.id_as;
    }
}
