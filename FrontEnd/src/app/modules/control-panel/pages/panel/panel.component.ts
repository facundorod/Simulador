import { ScenariosComponent } from "./../../modals/scenarios/scenarios.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Component, OnInit } from "@angular/core";

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
    animalSpecies: AnimalSpeciesI[];
    arrhythmias: ArrhythmiaI[];
    medications: MedicationI[];
    pathologies: PathologyI[];
    scenarios: ScenarioI[];
    scenariosSelected: any[] = [];

    scenarioSelect: Boolean = false;

    public order = {
        orderBy: "name",
        order: "asc",
    };

    constructor(
        private scenarioService: ScenarioService,
        private medicationsService: MedicationsService,
        private arrhythmiasService: ArrhythmiasService,
        private pathologiesService: PathologiesService,
        private animalSpeciesService: AnimalSpeciesService,
        private fb: FormBuilder,
        private modal: NgbModal
    ) {
        super();
    }

    ngOnInit(): void {
        this.initFormGroup();
        this.loadData();
    }

    private loadData() {
        this.setLoading(true);
        this.scenarioService.list(null, null).subscribe(
            (scenarios) => {
                this.setLoading(false);
                this.scenarios = scenarios.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

        this.arrhythmiasService.list(null, null).subscribe(
            (arrhythmias) => {
                this.arrhythmias = arrhythmias.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

        this.medicationsService.list(null, null).subscribe(
            (medications) => {
                this.medications = medications.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

        this.pathologiesService.list(null, null).subscribe(
            (pathologies) => {
                this.pathologies = pathologies.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

        this.animalSpeciesService.list(null, null).subscribe(
            (animalSpecies) => {
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
            scenarioName: [""],
            scenarioDescription: [""],
            scenarioId: ["", Validators.required],
            arrhythmias: ["", Validators.required],
            pathologies: ["", Validators.required],
            select: [false, Validators.required],
        });
    }

    public onSelectScenario(index: number) {
        const scenario: any = this.scenarios[index];
        if (scenario && !this.formGroup.value.select)
            this.scenariosSelected.push(scenario);
    }

    public onDeleteScenario(index: number) {
        this.scenarios.splice(index, 1);
    }

    public onSearchScenario() {}

    public onClearSearchScenario() {}

    public onAddScenario() {}

    public onSubmit() {}

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
