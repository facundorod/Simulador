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

@Component({
    selector: "app-panel",
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.css"],
})
export class PanelComponent extends BaseComponent implements OnInit {
    activeScenario: any = {};
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
        private medicationService: MedicationsService,
        private pathologyService: PathologiesService,
        private arrhythmiasService: ArrhythmiasService,
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

        this.arrhythmiasService.list().subscribe(
            (arrhythmias: any) => {
                this.arrhythmias = arrhythmias.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

        this.pathologyService.list().subscribe(
            (pathologies: any) => {
                this.pathologies = pathologies.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

        this.medicationService.list().subscribe(
            (medications: any) => {
                this.medications = medications.data;
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
                this.loadInfoScenario(this.simulation.scenarios);
            }
            if (this.simulation.animalSpecie)
                this.animalSpecie = this.simulation.animalSpecie;
        }

        this.setLoading(false);
    }

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
            scenarioName: [
                this.activeScenario ? this.activeScenario.name : "",
                Validators.required,
            ],
            scenarioId: [
                this.activeScenario ? this.activeScenario.id_scenario : "",
            ],
            animalSpecie: [this.animalSpecie ? this.animalSpecie : null],
            temp: ["", Validators.required],
            cardiacCycle: ["", Validators.required],
            respirationRate: ["", Validators.required],
            arrhythmias: this.fb.array([]),
            pathologies: this.fb.array([]),
            medications: this.fb.array([]),
        });

        this.setArrhythmias();
        this.setMedications();
        this.setPathologies();
    }

    public async onSaveChanges() {
        // this.setSubmitForm(true);

        // if (this.formGroup.valid) {

        let simulationData = this.simulation;

        // this.saveScenarioInfo();
        // this.saveSimulation();
        if (!simulationData) {
            console.log(this.scenariosSimulation);
            simulationData = {
                name: this.formGroup.value.simulationName,
                description: this.formGroup.value.simulationDescription,
                animalSpecie: {
                    id_as: this.formGroup.value.animalSpecie.id_as,
                    name: this.formGroup.value.animalSpecie.name,
                    description: this.formGroup.value.animalSpecie.description,
                },
                scenarios: this.scenariosSimulation,
            };

            this.simulationService.create(simulationData).subscribe(
                (data: any) => {
                    console.log(data);
                },
                (error: any) => {
                    console.log(error);
                }
            );
        }
    }

    private saveSimulation(): void {}

    private saveScenarioInfo(): void {
        const arrhythmias: any[] = [];
        this.formGroup.value.arrhythmias.forEach((arr: any) => {
            arrhythmias.push(arr.arrhythmia);
        });
        const pathologies: any[] = [];
        this.formGroup.value.pathologies.forEach((pat: any) => {
            pathologies.push(pat.pathology);
        });

        if (this.activeScenario) {
            this.activeScenario.pathologies = pathologies;
            this.activeScenario.arrhythmias = arrhythmias;
            this.activeScenario.medications = this.formGroup.value.medications;

            this.scenarioService
                .updateById(this.activeScenario.id_scenario, {
                    name: this.activeScenario.name,
                    description: this.activeScenario.description,
                    arrhythmias: arrhythmias,
                    medications: this.formGroup.value.medications,
                    pathologies: pathologies,
                })
                .subscribe(
                    (data) => {
                        console.log("Scenario Saved", data);
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
        }
    }

    addRowMedication(medication: any = null): void {
        const control = this.formGroup.get("medications") as FormArray;
        if (medication) control.push(this.initiateMedicationForm(medication));
        else control.push(this.initiateMedicationForm());
    }

    addRowPathology(pathology: any = null): void {
        const control = this.formGroup.get("pathologies") as FormArray;
        if (pathology) control.push(this.initiatePathologyForm(pathology));
        else control.push(this.initiatePathologyForm());
    }

    addRowArrhythmia(arrhythmia: any = null): void {
        const control = this.formGroup.get("arrhythmias") as FormArray;
        if (arrhythmia) {
            control.push(this.initiateArrhythmiaForm(arrhythmia));
        } else control.push(this.initiateArrhythmiaForm());
    }

    deleteRowMedication(index: number): void {
        const control = this.formGroup.get("medications") as FormArray;
        control.removeAt(index);
    }

    deleteRowPathology(index: number): void {
        const control = this.formGroup.get("pathologies") as FormArray;
        control.removeAt(index);
    }

    deleteRowArrhythmia(index: number): void {
        const control = this.formGroup.get("arrhythmias") as FormArray;
        control.removeAt(index);
    }

    get getFormControlsMedication() {
        return this.formGroup.get("medications") as FormArray;
    }

    get getFormControlsPathologies() {
        return this.formGroup.get("pathologies") as FormArray;
    }

    get getFormControlsArrhythmias() {
        return this.formGroup.get("arrhythmias") as FormArray;
    }

    private initiateMedicationForm(medication: any = null): AbstractControl {
        return this.fb.group({
            medication: [medication ? medication.medication : ""],
            dose: [medication ? medication.dose : ""],
            unit: [medication ? medication.unit : ""],
        });
    }

    private initiatePathologyForm(pathology: any = null): AbstractControl {
        return this.fb.group({
            pathology: [pathology ? pathology.name : ""],
        });
    }

    private initiateArrhythmiaForm(arrhythmia: any = null): AbstractControl {
        return this.fb.group({
            arrhythmia: [arrhythmia ? arrhythmia.name : ""],
        });
    }

    private loadInfoScenario(scenarios: any[]): void {
        this.scenariosSimulation = scenarios;
        this.activeScenario = this.scenariosSimulation[this.indexActive];

        if (this.activeScenario && this.activeScenario.arrhythmias) {
            this.arrhythmiasScenario = this.activeScenario.arrhythmias;
        } else {
            this.arrhythmiasScenario = [];
        }

        if (this.activeScenario && this.activeScenario.medications) {
            this.medicationsScenario = this.activeScenario.medications;
        } else {
            this.medicationsScenario = [];
        }

        if (this.activeScenario && this.activeScenario.pathologies) {
            this.pathologiesScenario = this.activeScenario.pathologies;
        } else {
            this.pathologiesScenario = [];
        }
    }

    private setArrhythmias(): void {
        if (this.arrhythmiasScenario.length > 0) {
            this.arrhythmiasScenario.forEach((arr) => {
                this.addRowArrhythmia(arr);
            });
        }
    }

    private setMedications(): void {
        if (this.medicationsScenario.length > 0) {
            this.medicationsScenario.forEach((med) => {
                if (med.medication !== null)
                    this.addRowMedication({
                        dose: med.dose,
                        unit: med.unit,
                        medication: med.medication ? med.medication.name : null,
                    });
            });
        }
    }

    private setPathologies(): void {
        if (this.pathologiesScenario.length > 0) {
            this.pathologiesScenario.forEach((pat) => {
                this.addRowPathology(pat);
            });
        }
    }

    getScenarios(scenarios: any): void {
        this.loadInfoScenario(scenarios);
        this.initFormGroup();
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
