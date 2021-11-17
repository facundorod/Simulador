import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AnimalSpeciesResponseI } from "@app/shared/models/animal-specieResponse";
import { AnimalSpeciesI } from "@app/shared/models/animal-speciesI";
import { AnimalParametersI } from "@app/shared/models/animaParametersI";
import { ArrhythmiaI } from "@app/shared/models/arrhythmiaI";
import { ArrhythmiaResponseI } from "@app/shared/models/arrhythmiasResponse";
import { MedicationI } from "@app/shared/models/medicationI";
import { MedicationScenarioI } from "@app/shared/models/medicationScenarioI";
import { MedicationResponseI } from "@app/shared/models/medicationsResponse";
import { PathologiesResponseI } from "@app/shared/models/pathologiesResponse";
import { PathologyI } from "@app/shared/models/pathologyI";
import { ScenarioParamsI } from "@app/shared/models/scenarioParamsI";
import { AnimalSpeciesService } from "../../services/animalSpecies.service";
import { ArrhythmiasService } from "../../services/arrhythmias.service";
import { MedicationsService } from "../../services/medications.service";
import { PathologiesService } from "../../services/pathologies.service";
import { ScenarioService } from "../../services/scenario.service";

@Component({
    selector: "app-scenario-params-create",
    templateUrl: "./scenario-params-create.component.html",
    styleUrls: ["./scenario-params-create.component.css"],
})
export class ScenarioParamsCreateComponent implements OnInit {
    private animals: AnimalSpeciesI[] = [];
    private medications: MedicationI[] = [];
    private arrhythmias: ArrhythmiaI[] = [];
    private pathologies: PathologyI[] = [];
    private loading: boolean = true;
    private scenario: ScenarioParamsI;
    private formGroupScenario: FormGroup;
    private params: { id: number };

    constructor(
        private animalSpecieService: AnimalSpeciesService,
        private medicationService: MedicationsService,
        private pathologiesService: PathologiesService,
        private arrhythmiasService: ArrhythmiasService,
        private scenarioService: ScenarioService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute
    ) {
        const params = activatedRoute.snapshot.params;
        if (params && params.id) this.params = { id: Number(params.id) };
    }

    ngOnInit(): void {
        if (this.params && this.params.id) this.loadScenario();
        this.loadData();
        this.initForm();
    }

    private loadData(): void {
        this.loading = true;
        this.loadAnimals();
        this.loadArrhythmias();
        this.loadMedications();
        this.laodPathologies();
        this.loading = false;
    }

    private loadScenario(): void {
        this.scenarioService.listByIdWithParams(this.params.id).subscribe(
            (scenario: ScenarioParamsI[]) => {
                [this.scenario] = scenario;
                this.initForm();
            },
            (error: Error) => {
                console.error(error);
            }
        );
    }

    private loadAnimals(): void {
        this.animalSpecieService.list().subscribe(
            (animalSpecie: AnimalSpeciesResponseI) => {
                if (animalSpecie) this.animals = animalSpecie.data;
            },
            (error: Error) => {
                console.error(error);
            }
        );
    }

    private loadMedications(): void {
        this.medicationService.list().subscribe(
            (medications: MedicationResponseI) => {
                if (medications) this.medications = medications.data;
            },
            (error: Error) => {
                console.error(error);
            }
        );
    }

    private loadArrhythmias(): void {
        this.arrhythmiasService.list().subscribe(
            (arrhythmias: ArrhythmiaResponseI) => {
                if (arrhythmias) this.arrhythmias = arrhythmias.data;
            },
            (error: Error) => {
                console.error(error);
            }
        );
    }

    private laodPathologies(): void {
        this.pathologiesService.list().subscribe(
            (pathologies: PathologiesResponseI) => {
                if (pathologies) this.pathologies = pathologies.data;
            },
            (error: Error) => {
                console.error(error);
            }
        );
    }

    public getArrhythmias(): ArrhythmiaI[] {
        return this.arrhythmias;
    }

    public getPathologies(): PathologyI[] {
        return this.pathologies;
    }

    public getAnimals(): AnimalSpeciesI[] {
        return this.animals;
    }

    public getMedications(): MedicationI[] {
        return this.medications;
    }

    public isLoadint(): boolean {
        return this.loading;
    }

    private initForm(): void {
        const animalParameters: AnimalParametersI =
            this.scenario?.parametersScenario[0]?.animalParameters;
        this.formGroupScenario = this.fb.group({
            scenarioName: [this.scenario ? this.scenario.name : ""],
            scenarioDescription: [
                this.scenario ? this.scenario.description : "",
            ],
            animalSpecie: [
                animalParameters ? animalParameters.animalSpecie : null,
            ],
            medications: new FormArray([]),
            arrhythmias: new FormArray([]),
            pathologies: new FormArray([]),
        });

        this.loadMedicationForm();
        this.loading = false;
    }

    public getForm(): FormGroup {
        return this.formGroupScenario;
    }

    public isLoading(): boolean {
        return this.loading;
    }

    private loadMedicationForm(): void {
        const medication: MedicationScenarioI[] = this.scenario?.medications;
        const control = this.formGroupScenario.get("medications") as FormArray;
        if (medication && medication.length) {
            medication.forEach((medication: MedicationScenarioI) => {
                control.push(
                    this.fb.group({
                        dose: medication.dose,
                        unit: medication.unit,
                        medication: medication.medication,
                    })
                );
            });
        }
    }

    public getMedicationsForm(): FormArray {
        return this.formGroupScenario.get("medications") as FormArray;
    }

    public compareAnimals(a1: AnimalSpeciesI, a2: AnimalSpeciesI): boolean {
        if (a1 && a2) return a1.id_as == a2.id_as;
        if (!a1 && !a2) return true;
        return false;
    }

    public deleteRowMedication(index: number) {
        const control = this.formGroupScenario.get("medications") as FormArray;
        control.removeAt(index);
    }
}
