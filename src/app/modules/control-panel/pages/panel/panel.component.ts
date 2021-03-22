import { SimulationService } from "./../../../simulation/services/simulation.service";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Component, Input, OnInit } from "@angular/core";

// Service
import { AnimalSpeciesService } from "./../../services/animalSpecies.service";
import { MedicationsService } from "./../../services/medications.service";
import { ScenarioService } from "./../../services/scenario.service";
import { ArrhythmiasService } from "./../../services/arrhythmias.service";
import { PathologiesService } from "./../../services/pathologies.service";

// Models
import { PathologyI } from "@models/pathologyI";
import { MedicationI } from "@models/medicationI";
import { ArrhythmiaI } from "@models/arrhythmiaI";
import { AnimalSpeciesI } from "@models/animal-speciesI";
import { BaseComponent } from "@app/shared/components/base.component";
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    Validators,
} from "@angular/forms";
import { ConfirmModalComponent } from "@app/shared/modals/confirm/confirm-modal.component";

@Component({
    selector: "app-panel",
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.css"],
})
export class PanelComponent extends BaseComponent implements OnInit {
    activeScenario: any = {};
    simulationsNumber: number = 0; // Number of simulation's scenario.
    scenarios: any[] = [];
    scenariosSimulation: any[] = [];
    animalSpecies: any[] = []; // Animal Species to populate the dropdown
    animalSpecie: any = {}; // Animal Specie from simulation
    arrhythmias: any[] = []; // Arrhythmias to populate the dropdown
    arrhythmiasScenario: any[] = []; // Arrhythmias from scenario
    pathologies: any[] = [];
    pathologiesScenario: any[] = []; // Pathologies from scenario
    medications: any[] = [];
    medicationsScenario: any[] = [];
    simulation: any = {};
    indexActive: number = 0;
    indexSimulationActive: number = 0;
    private physiologicalParameters: any = {};
    private tempValue: number;
    private cardiacCycleValue: number;
    private repRateValue: number;
    public order = {
        orderBy: "name",
        order: "asc",
    };

    constructor(
        private scenarioService: ScenarioService,
        private animalSpecieService: AnimalSpeciesService,
        private fb: FormBuilder,
        private modal: NgbModal,
        private toast: ToastrService,
        private simulationService: SimulationService
    ) {
        super();
    }

    ngOnInit(): void {
        this.setSubmitForm(false);
        this.setLoading(true);
        this.loadData();
        this.initFormGroup();
    }

    /**
     * Load all data necesary for forms
     */
    private loadData() {
        this.simulation = JSON.parse(localStorage.getItem("Simulation"));

        this.scenarioService.list(null, null).subscribe(
            (scenarios) => {
                this.scenarios = scenarios.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

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
            this.animalSpecieService.list(null, null).subscribe(
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
            }
            if (this.simulation.animalSpecie)
                this.animalSpecie = this.simulation.animalSpecie;
        }

        this.setLoading(false);
    }

    /**
     * Initialize the reactive form
     */
    private initFormGroup() {
        this.setSubmitForm(false);
        this.formGroup = this.fb.group({
            simulationName: [
                this.simulation ? this.simulation.name : "",
                Validators.required,
            ],
            simulationDescription: [
                this.simulation ? this.simulation.description : "",
                Validators.required,
            ],
            animalSpecie: [this.animalSpecie ? this.animalSpecie : ""],
        });
    }

    /**
     * Save scenario and simulations according to form data
     */
    public async onSaveChanges() {
        this.submitForm = true;
        this.saveSimulation();
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

    getScenarios(scenarios: any): void {
        this.scenariosSimulation = scenarios;
        this.activeScenario = this.scenariosSimulation[this.indexActive];
    }

    getPosScenarios(pos: any): void {
        this.indexActive = pos.indexEdit;
        this.indexSimulationActive = pos.indexActive;
    }

    /**
     *  TrackByFn: Define como rastrear los cambios en los ítems utilizados en el *ngFor.
     *  Aumenta el rendimiento, ya que solo se vuelven a representar en el DOM los nodos
     *  que han sido actualizados.
     */
    trackByFnAnimalSpecies(index: number, name: AnimalSpeciesI): number {
        return name.id_as;
    }

    trackByFnMedications(index: number, name: MedicationI): number {
        return name.id_medication;
    }

    trackByFnArrhythmias(index: number, name: ArrhythmiaI): number {
        return name.id_arr;
    }

    trackByFnPathologies(index: number, name: PathologyI): number {
        return name.id_pat;
    }
}
