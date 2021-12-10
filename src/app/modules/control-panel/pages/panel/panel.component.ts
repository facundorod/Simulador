import { SimulationService } from "./../../../simulation/services/simulation.service";
import { ToastrService } from "ngx-toastr";
import { Component, OnDestroy, OnInit } from "@angular/core";

// Service
import { AnimalSpeciesService } from "./../../services/animalSpecies.service";

// Models

import { AnimalSpeciesI } from "@models/animal-speciesI";
import { BaseComponent } from "@app/shared/components/base.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CurvesService } from "../../services/curves.service";
import { CurvesI } from "@app/shared/models/curvesI";
import { CurvesHelper } from "./../../../simulation/helpers/curvesHelper";
import { LocalStorageService } from "@app/shared/services/localStorage.service";
import { StatesI } from "@app/shared/models/stateI";
import { environment } from "@environments/environment";
import { Monitor } from "@app/shared/models/monitor";
import { ParameterInfoI } from "@app/shared/models/parameterInfoI";
import { ScenarioParamsI } from "@app/shared/models/scenarioParamsI";

@Component({
    selector: "app-panel",
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.css"],
})
export class PanelComponent extends BaseComponent implements OnInit, OnDestroy {
    private activeScenario: ScenarioParamsI; // Scenario active for simulation

    public scenariosSimulation: ScenarioParamsI[] = [];
    public animalSpecies: AnimalSpeciesI[] = []; // Animal Species to populate the dropdown
    public animalSpecie: any = {}; // Animal Specie from simulation
    public simulation: any = {}; // Simulation from localStorage
    public indexActive: number = 0; // Index for scenario edit Active
    public indexSimulationActive: number = 0; // Index for scenario simulation Active
    public currentState: StatesI; // Curves for scenario and animalSpecie selected
    // Paramaters Physiological without curves
    public fromGroupParameters: FormGroup;
    public heartRate: number = 0;
    public breathRate: number = 0;
    public temperature: number = 0;
    public spo2: number = 0;
    public muteAlarms: boolean = false;
    public monitorConfiguration: Monitor = new Monitor();

    constructor(
        private animalSpecieService: AnimalSpeciesService,
        private fb: FormBuilder,
        private toast: ToastrService,
        private simulationService: SimulationService,
        private curvesService: CurvesService,
        private localStorageService: LocalStorageService
    ) {
        super();
    }

    ngOnInit(): void {
        this.localStorageService.removeValue("simulationState");

        this.setSubmitForm(false);
        this.setLoading(true);
        this.loadData();
        this.initFormGroup();
        this.initFormParameters();
        this.onValueChanges();
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
            (error: Error) => {
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
            ],
        });
    }

    private initFormValues(): void {
        this.heartRate = 0;
        this.breathRate = 0;
        this.temperature = 0;
        this.spo2 = 0;
        this.fromGroupParameters.setValue({
            heartRate: 0,
            breathRate: 0,
            temperature: 0,
            spo2: 0,
        });
    }

    private initFormParameters(): void {
        this.fromGroupParameters = this.fb.group({
            heartRate: [this.heartRate ? this.heartRate : 0],
            breathRate: [this.breathRate ? this.breathRate : 0],
            temperature: [this.temperature ? this.temperature : 0],
            spo2: [this.spo2 ? this.spo2 : 0],
        });
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
        this.fromGroupParameters
            .get("heartRate")
            .valueChanges.subscribe((val) => {
                this.heartRate = val;
            });
        this.fromGroupParameters
            .get("breathRate")
            .valueChanges.subscribe((val) => {
                this.breathRate = val;
            });
        this.fromGroupParameters
            .get("temperature")
            .valueChanges.subscribe((val) => {
                this.temperature = val;
            });
        this.fromGroupParameters.get("spo2").valueChanges.subscribe((val) => {
            this.spo2 = val;
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
                            let action: string = "stop";
                            let newScenario: boolean = false;
                            if (this.currentState) {
                                action = "play";
                                newScenario = true;
                            }
                            this.currentState = state;
                            this.currentState.action = action;
                            this.currentState.muteAlarms = false;
                            this.currentState.newScenario = newScenario;
                            this.onLoadParameters();
                            this.applyChanges();
                        } else {
                            this.currentState = null;
                            this.localStorageService.removeValue(
                                "simulationState"
                            );
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

    public applyChanges(): void {
        this.localStorageService.saveValue(
            "simulationState",
            JSON.stringify(this.currentState)
        );
        this.saveParameterInfo();
        this.updateState();
    }

    /**
     * Load parameters without curves
     * @param state
     */
    private onLoadParameters(): void {
        this.currentState.curves = this.currentState.curves.filter(
            (value: CurvesI) => {
                switch (value.curveConfiguration.label.toUpperCase()) {
                    case "RESP":
                        this.breathRate = value.curveConfiguration.refValue;
                        return value;
                    case "CAR":
                        this.heartRate = value.curveConfiguration.refValue;
                        return value;
                    case "TEMP":
                        this.temperature = value.curveConfiguration.refValue;
                        return value;
                    case "SPO2":
                        this.spo2 = value.curveConfiguration.refValue;
                        return value;
                    default:
                        return value;
                }
            }
        );
    }

    private saveParameterInfo(): void {
        const parameterInfo: ParameterInfoI = {
            temperature: this.temperature,
            heartRate: this.heartRate,
            breathRate: this.breathRate,
            spO2: this.spo2,
        };
        this.localStorageService.saveValue(
            "parameterState",
            JSON.stringify(parameterInfo)
        );
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
                (error: Error) => {
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
                    (error: Error) => {
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
        if (
            this.activeScenario !=
            this.scenariosSimulation[this.indexSimulationActive]
        ) {
            this.activeScenario =
                this.scenariosSimulation[this.indexSimulationActive];
            this.currentState = null;
            this.initFormValues();
            this.onLoadCurves(this.formGroup.value.animalSpecie);
        }
    }

    public getPosScenarios(pos: any): void {
        if (this.indexSimulationActive != pos.indexActive) {
            this.indexSimulationActive = pos.indexActive;
            this.initFormValues();
            this.onLoadCurves(this.formGroup.value.animalSpecie);
        }
        this.indexActive = pos.indexEdit;
    }

    public onPlaySimulation(): void {
        if (this.currentState) this.currentState.action = "play";
        this.localStorageService.saveValue(
            "simulationState",
            JSON.stringify(this.currentState)
        );
    }

    public onPauseSimulation(): void {
        if (this.currentState) this.currentState.action = "pause";
        this.localStorageService.saveValue(
            "simulationState",
            JSON.stringify(this.currentState)
        );
    }

    public onMuteAlarms(): void {
        if (this.currentState) this.currentState.muteAlarms = true;
        this.muteAlarms = true;
        this.updateState();
    }

    public onUnmuteAlarms(): void {
        if (this.currentState) this.currentState.muteAlarms = false;
        this.muteAlarms = false;
        this.updateState();
    }

    public onStopSimulation(): void {
        if (this.currentState) this.currentState.action = "stop";
        this.localStorageService.saveValue(
            "simulationState",
            JSON.stringify(this.currentState)
        );
    }

    private updateState(): void {
        if (this.currentState) {
            this.currentState.state++;
            this.currentState.newScenario = false;
            this.localStorageService.saveValue(
                "simulationState",
                JSON.stringify(this.currentState)
            );
        }
    }

    public getRate(index: number): number {
        const curve: CurvesI = this.currentState.curves[index];
        if (
            curve.curveConfiguration.label.toUpperCase() === "ETCO2" ||
            curve.curveConfiguration.label.toUpperCase() === "CO2"
        )
            return this.breathRate;
        return this.heartRate;
    }

    public breathCurve(index: number): boolean {
        const curve: CurvesI = this.currentState.curves[index];
        if (
            curve.curveConfiguration.label.toUpperCase() === "ETCO2" ||
            curve.curveConfiguration.label.toUpperCase() === "CO2"
        )
            return true;
        return false;
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
