import { SimulationService } from "./../../../simulation/services/simulation.service";
import { ScenariosComponent } from "./../../../simulation/modals/scenarios/scenarios.component";
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
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-panel",
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.css"],
})
export class PanelComponent extends BaseComponent implements OnInit {
    activeScenario: any = {};
    scenarios: any[] = [];
    scenariosSimulation: any[] = [];
    animalSpecies: any[] = [];
    arrhythmias: any[] = [];
    pathologies: any[] = [];
    medications: any[] = [];
    simulation: any = {};

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
        this.loadData();
        this.initFormGroup();
    }

    private loadData() {
        this.setLoading(true);
        this.submitForm = false;
        this.animalSpecieService.list(null, null).subscribe(
            (animalSpecies) => {
                this.setLoading(false);
                this.animalSpecies = animalSpecies.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

        if (this.simulation.scenarios)
            this.scenariosSimulation = this.simulation.scenarios;

        this.scenarioService.list(null, null).subscribe(
            (scenarios) => {
                this.scenarios = scenarios.data;
                this.activeScenario = this.scenariosSimulation[0];
                console.log(this.activeScenario);
                this.initFormGroup();
            },
            (error: any) => {
                console.log(error);
            }
        );

        if (this.activeScenario) {
            console.log(this.activeScenario);
            if (this.activeScenario.arrhythmias)
                this.arrhythmias = this.activeScenario?.arrhythmias;
            if (this.activeScenario.medications)
                this.medications = this.activeScenario?.mPerScenario;
            if (this.activeScenario.pathologies)
                this.pathologies = this.activeScenario?.pathologies;
        }
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            simulationName: ["", Validators.required],
            simulationDescription: ["", Validators.required],
            scenarioName: [
                this.activeScenario ? this.activeScenario.name : "",
                Validators.required,
            ],
            scenarioDescription: [
                this.activeScenario ? this.activeScenario.description : "",
                Validators.required,
            ],
            scenarioId: [
                this.activeScenario ? this.activeScenario.id_scenario : "",
                Validators.required,
            ],
            animalSpecie: [""],
            dose: ["", Validators.required],
            units: ["", Validators.required],
            temp: ["", Validators.required],
            cardiacCycle: ["", Validators.required],
            respirationRate: ["", Validators.required],
            arrhythmia: ["", Validators.required],
            pathology: ["", Validators.required],
            medication: ["", Validators.required],
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
    }

    public onSelectScenario() {}

    public async onSaveChanges() {
        this.setSubmitForm(true);

        if (this.formGroup.valid) {
            // Save data on simulation table

            this.scenarioService.saveArrhythmias(this.arrhythmias);
            this.scenarioService.savePathologies(this.pathologies);
            this.scenarioService.saveMedications(this.medications);
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

    public onDeleteScenario() {
        for (
            let i = 0;
            i < this.formGroup.value.scenarioSelected.length;
            i += 1
        ) {
            if (this.formGroup.value.scenarioSelected[i].value) {
                this.scenariosSimulation.splice(i, 1);
                this.formGroup.value.scenarioSelected.splice(i, 1);
            }
        }
        this.activeScenario = this.scenariosSimulation[0];
    }

    public containsTrue(): boolean {
        return this.formGroup.value.scenarioSelected.some(
            (check: any) => check.value == true
        );
    }

    public onLoadScenario() {
        const modal = this.modal.open(ScenariosComponent);

        modal.componentInstance.setScenarios(this.scenarios);

        modal.result.then((scenarios: any[]) => {
            if (scenarios) {
                this.activeScenario = scenarios[0];
                // this.loadData();
                scenarios.forEach((sc: any) => {
                    this.scenariosSimulation.push(sc);
                    (<FormArray>this.formGroup.get("scenarioSelected")).push(
                        this.fb.group({
                            value: [false],
                        })
                    );
                });
            }
        });
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
