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
import { ScenarioI } from "@models/scenarioI";
import { BaseComponent } from "@app/shared/components/base.component";
import {
    AbstractControl,
    FormArray,
    FormBuilder,
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
    pathologies: any[] = [];
    medications: any[] = [];
    medicationsScenario: any[] = [];
    simulation: any = {};
    form: boolean = false;

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
        this.form = false;

        this.setSubmitForm(false);
        this.setLoading(true);
        this.loadData();
        this.initFormGroup();
    }

    private loadData() {
        this.simulation = JSON.parse(localStorage.getItem("Simulation"));
        if (this.activeScenario) {
            this.medicationsScenario = this.activeScenario.medications;
        }

        this.scenarioService.list(null, null).subscribe(
            (scenarios) => {
                this.scenarios = scenarios.data;
                this.initFormGroup();
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
                this.scenariosSimulation = this.simulation.scenarios;
                this.activeScenario = this.scenariosSimulation[0];
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
            animalSpecie: [
                this.animalSpecie ? this.animalSpecie.name : "",
                Validators.required,
            ],
            temp: ["", Validators.required],
            cardiacCycle: ["", Validators.required],
            respirationRate: ["", Validators.required],
            arrhythmias: this.fb.array([]),
            pathologies: this.fb.array([]),
            medications: this.fb.array([]),
            scenarioSelected: this.fb.array([]),
        });

        if (this.scenariosSimulation) {
            this.scenariosSimulation.forEach(() => {
                (<FormArray>this.formGroup.get("scenarioSelected")).push(
                    this.fb.group({
                        value: [false],
                    })
                );
            });
        }

        this.addRowMedication();
        this.addRowPathology();
        this.addRowArrhythmia();
    }

    public async onSaveChanges() {
        this.setSubmitForm(true);
        this.form = true;
        if (this.formGroup.valid) {
            // Save data on simulation table

            this.scenarioService.saveArrhythmias(
                this.arrhythmias,
                this.formGroup.value.scenarioId
            );
            this.scenarioService.savePathologies(
                this.pathologies,
                this.formGroup.value.scenarioId
            );
            this.scenarioService.saveMedications(
                this.medications,
                this.formGroup.value.scenarioId
            );
            this.simulationService.create(this.simulation).subscribe(
                (data) => {
                    if (data) {
                        this.toast.toastrConfig.timeOut = 1000;
                        this.toast.toastrConfig.positionClass =
                            "toast-bottom-full-width";
                        this.toast.success("Simulation saved sucessfully!");
                    }
                },
                (error: any) => {
                    console.log(error);
                }
            );
        }
    }

    // public onDeleteScenario() {
    //     for (
    //         let i = 0;
    //         i < this.formGroup.value.scenarioSelected.length;
    //         i += 1
    //     ) {
    //         if (this.formGroup.value.scenarioSelected[i].value) {
    //             this.scenariosSimulation.splice(i, 1);
    //             this.formGroup.value.scenarioSelected.splice(i, 1);
    //         }
    //     }
    //     this.activeScenario = this.scenariosSimulation[0];
    // }

    // public containsTrue(): boolean {
    //     return this.formGroup.value.scenarioSelected.some(
    //         (check: any) => check.value == true
    //     );
    // }

    // public onLoadScenario() {
    //     const modal = this.modal.open(ScenariosModalComponent);
    //     modal.componentInstance.setScenarios(this.scenarios);

    //     modal.result.then((scenarios: any[]) => {
    //         if (scenarios) {
    //             this.activeScenario = scenarios[0];
    //             // this.loadData();
    //             scenarios.forEach((sc: any) => {
    //                 this.scenariosSimulation.push(sc);
    //                 (<FormArray>this.formGroup.get("scenarioSelected")).push(
    //                     this.fb.group({
    //                         value: [false],
    //                     })
    //                 );
    //             });
    //         }
    //     });
    // }

    addRowMedication(): void {
        const control = this.formGroup.get("medications") as FormArray;
        control.push(this.initiateMedicationForm());
    }

    addRowPathology(): void {
        const control = this.formGroup.get("pathologies") as FormArray;
        control.push(this.initiatePathologyForm());
    }

    addRowArrhythmia(): void {
        const control = this.formGroup.get("arrhythmias") as FormArray;
        control.push(this.initiateArrhythmiaForm());
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

    private initiateMedicationForm(): AbstractControl {
        return this.fb.group({
            medication: [""],
            doses: [""],
            unit: [""],
        });
    }

    private initiatePathologyForm(): AbstractControl {
        return this.fb.group({
            pathology: [""],
        });
    }

    private initiateArrhythmiaForm(): AbstractControl {
        return this.fb.group({
            arrhythmia: [""],
        });
    }

    changeAnimalSpecie(e) {
        this.formGroup.value.animalSpecie = e.target.value;
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

    trackByFnScenarios(index: number, name: ScenarioI): number {
        return name.id_scenario;
    }
}
