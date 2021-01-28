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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-panel",
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.css"],
})
export class PanelComponent extends BaseComponent implements OnInit {
    scenario: any = {};
    scenarios: any = [];
    scenarioSelect: Boolean = false;
    animalSpecies: any = [];
    arrhythmias: ArrhythmiaI[] = [];
    pathologies: PathologyI[] = [];
    medications: any = [];

    public order = {
        orderBy: "name",
        order: "asc",
    };

    constructor(
        private scenarioService: ScenarioService,
        private animalSpecieService: AnimalSpeciesService,
        private fb: FormBuilder,
        private modal: NgbModal,
        private toast: ToastrService
    ) {
        super();
    }

    ngOnInit(): void {
        this.loadData();
        this.initFormGroup();
    }

    private loadData() {
        this.setLoading(true);
        this.scenario = JSON.parse(localStorage.getItem("Scenario"));

        if (this.scenario) {
            this.animalSpecies = this.scenario.animalSpecies;
            this.arrhythmias = this.scenario.arrhythmias;
            this.medications = this.scenario.mPerScenario;
            this.pathologies = this.scenario.pathologies;
        }

        this.scenarioService.list(null, null).subscribe(
            (scenarios) => {
                this.scenarios = scenarios.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

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

    private initFormGroup() {
        this.formGroup = this.fb.group({
            simulationName: ["", Validators.required],
            simulationDescription: ["", Validators.required],
            scenarioName: [
                this.scenario ? this.scenario.name : "",
                Validators.required,
            ],
            scenarioDescription: [
                this.scenario ? this.scenario.description : "",
                Validators.required,
            ],
            scenarioId: [
                this.scenario ? this.scenario.id_scenario : "",
                Validators.required,
            ],
            animalSpecie: [""],
            dose: ["", Validators.required],
            unit: ["", Validators.required],
            temp: ["", Validators.required],
            cardiacCycle: ["", Validators.required],
            respirationRate: ["", Validators.required],
            arrhythmia: ["", Validators.required],
            pathology: ["", Validators.required],
            medication: ["", Validators.required],
        });
    }

    public onSelectScenario() {}

    public onSaveChanges() {
        this.setSubmitForm(true);

        if (this.formGroup.valid) {
            // Save data on simulation table
            this.toast.toastrConfig.timeOut = 1000;
            this.toast.toastrConfig.positionClass = "toast-bottom-full-width";
            this.toast.success("Simulation saved sucessfully!");
        }
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
