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
import { PhysiologicalParamaterI } from "@app/shared/models/physiologicalParamaterI";
import { ScenarioParamsI } from "@app/shared/models/scenarioParamsI";
import { SPPI } from "@app/shared/models/SPPI";
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
    private parameters: SPPI[] = [];
    private loading: boolean = true;
    private scenario: ScenarioParamsI;
    private formGroupScenario: FormGroup;
    private params: { id: number };
    private fileNames: string[] = [];

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
                this.parameters = this.scenario.parametersScenario;
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

    public getParameters(): SPPI[] {
        return this.parameters;
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
        this.loadPathologiesForm();
        this.loadArrhythmiasForm();
        this.loadCurves();
        this.loading = false;
    }

    public getForm(): FormGroup {
        return this.formGroupScenario;
    }

    public isLoading(): boolean {
        return this.loading;
    }

    public onAddScenario(): void {
        console.log("", this.parameters);
    }

    private loadMedicationForm(): void {
        const medication: MedicationScenarioI[] = this.scenario?.medications;
        const medControl: FormArray = this.formGroupScenario.get(
            "medications"
        ) as FormArray;
        if (medication && medication.length) {
            medication.forEach((medication: MedicationScenarioI) => {
                medControl.push(
                    this.fb.group({
                        dose: medication.dose,
                        unit: medication.unit,
                        medication: medication.medication
                            ? medication.medication
                            : null,
                    })
                );
            });
        }
    }

    private loadPathologiesForm(): void {
        const pathologies: PathologyI[] = this.scenario?.pathologies;
        const pathControl: FormArray = this.formGroupScenario.get(
            "pathologies"
        ) as FormArray;
        if (pathologies && pathologies.length) {
            pathologies.forEach((pat: PathologyI) => {
                pathControl.push(
                    this.fb.group({
                        pathology: pat,
                    })
                );
            });
        }
    }

    private loadArrhythmiasForm(): void {
        const arrhythmias: ArrhythmiaI[] = this.scenario?.arrhythmias;
        const arrhythmiaControl: FormArray = this.formGroupScenario.get(
            "arrhythmias"
        ) as FormArray;
        if (arrhythmias && arrhythmias.length) {
            arrhythmias.forEach((arr: ArrhythmiaI) => {
                arrhythmiaControl.push(this.fb.group({ arrhythmia: arr }));
            });
        }
    }

    public loadCurves(): void {
        this.parameters.forEach(() => {
            this.fileNames.push("");
        });
    }

    public getMedicationsForm(): FormArray {
        return this.formGroupScenario.get("medications") as FormArray;
    }

    public getPathologiesForm(): FormArray {
        return this.formGroupScenario.get("pathologies") as FormArray;
    }

    public getArrhythmiasForm(): FormArray {
        return this.formGroupScenario.get("arrhythmias") as FormArray;
    }

    public deleteRowMedication(index: number): void {
        const control = this.formGroupScenario.get("medications") as FormArray;
        control.removeAt(index);
    }

    public addRowMedication(): void {
        const medControl: FormArray = this.formGroupScenario.get(
            "medications"
        ) as FormArray;

        medControl.push(
            this.fb.group({ dose: "", unit: "", medication: null })
        );
    }

    public addRowPathology(): void {
        const pathControl: FormArray = this.formGroupScenario.get(
            "pathologies"
        ) as FormArray;

        pathControl.push(this.fb.group({ pathology: null }));
    }

    public deleteRowPathology(index: number): void {
        const control = this.formGroupScenario.get("pathologies") as FormArray;
        control.removeAt(index);
    }

    public addRowArrhythmia(): void {
        const arrControl: FormArray = this.formGroupScenario.get(
            "arrhythmias"
        ) as FormArray;
        arrControl.push(this.fb.group({ arrhythmia: null }));
    }

    public deleteRowArrhythmia(index: number): void {
        const control = this.formGroupScenario.get("arrhythmias") as FormArray;
        control.removeAt(index);
    }

    // Compare Objects in select //

    public compareAnimals(a1: AnimalSpeciesI, a2: AnimalSpeciesI): boolean {
        if (a1 && a2) return a1.id_as == a2.id_as;
        if (!a1 && !a2) return true;
        return false;
    }

    public compareMedications(m1: MedicationI, m2: MedicationI): boolean {
        if (m1 && m2) return m1.id_medication == m2.id_medication;
        if (!m1 && !m2) return true;
        return false;
    }

    public comparePathologies(p1: PathologyI, p2: PathologyI): boolean {
        if (p1 && p2) return p1.id_pat == p2.id_pat;
        if (!p1 && !p2) return true;
        return false;
    }

    public compareArrhythmias(a1: ArrhythmiaI, a2: ArrhythmiaI): boolean {
        if (a1 && a2) return a1.id_arr == a2.id_arr;
        if (!a1 && !a2) return true;
        return false;
    }

    // End compare Objects in select //

    public existsMedications(): boolean {
        const medControl: FormArray = this.formGroupScenario.get(
            "medications"
        ) as FormArray;
        return medControl && medControl.length > 0;
    }

    public existsArrhythmias(): boolean {
        const arrControl: FormArray = this.formGroupScenario.get(
            "arrhythmias"
        ) as FormArray;
        return arrControl && arrControl.length > 0;
    }

    public existsPathologies(): boolean {
        const pathControl: FormArray = this.formGroupScenario.get(
            "pathologies"
        ) as FormArray;
        return pathControl && pathControl.length > 0;
    }

    public onDeleteParameter(index: number): void {
        this.parameters.splice(index, 1);
    }

    public changeCurves(index: number) {
        return (
            this.fileNames[index] !== "" ||
            this.parameters[index].curves.length > 0
        );
    }

    public onDeleteCurves(index: number) {
        this.parameters[index].curves = [];
        this.fileNames[index] = "";
    }

    public onFileChange(event: any, index: number): void {
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            this.fileNames[index] = file.name;
        }
    }
}
