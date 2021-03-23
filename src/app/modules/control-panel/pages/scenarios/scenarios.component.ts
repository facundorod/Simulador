import { ScenarioService } from "./../../services/scenario.service";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ScenariosModalComponent } from "@app/modules/simulation/modals/scenarios-modal/scenarios-modal.component";
import { ArrayJsonPipe } from "../../../../shared/pipes/array-json.pipe";
import { ScenariosCreateComponent } from "../../modals/scenarios-create/scenarios-create.component";
import { MedicationsService } from "../../services/medications.service";
import { PathologiesService } from "../../services/pathologies.service";
import { ArrhythmiasService } from "../../services/arrhythmias.service";
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    Validators,
} from "@angular/forms";
import { SimulationService } from "@app/modules/simulation/services/simulation.service";
import { ToastrService } from "ngx-toastr";
import { ConfirmModalComponent } from "@app/shared/modals/confirm/confirm-modal.component";
@Component({
    selector: "app-scenarios",
    templateUrl: "./scenarios.component.html",
    styleUrls: ["./scenarios.component.css"],
})
export class ScenariosComponent extends BaseComponent implements OnInit {
    @Input() scenariosSelected: any[];
    @Output() returnScenarios: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() posScenarios: EventEmitter<any> = new EventEmitter<any>();

    scenarios: any[];
    indexScenarioActive: number;
    indexScenarioEdit: number;
    arrhythmias: any[] = []; // Arrhythmias to populate the dropdown
    arrhythmiasScenario: any[] = []; // Arrhythmias from scenario
    pathologies: any[] = [];
    pathologiesScenario: any[] = []; // Pathologies from scenario
    medications: any[] = [];
    medicationsScenario: any[] = [];
    tempValue: number;
    cardiacCycleValue: number;
    repRateValue: number;
    scenariosSimulation: any[];
    activeScenario: any;
    simulationsNumber: number = 0;

    constructor(
        private scenariosService: ScenarioService,
        private modal: NgbModal,
        private toast: ToastrService,
        private fb: FormBuilder,
        private medicationService: MedicationsService,
        private pathologyService: PathologiesService,
        private arrhythmiasService: ArrhythmiasService,
        private simulationService: SimulationService
    ) {
        super();
        this.indexScenarioActive = 0;
        this.indexScenarioEdit = 0;
    }

    ngOnInit(): void {
        this.loadData();
        this.initFormGroup();
    }

    loadData() {
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

        if (this.scenariosSelected.length > 0)
            this.loadInfoScenario(this.scenariosSelected);
    }

    onAddScenario(): void {
        const modal = this.modal.open(ScenariosCreateComponent);
        modal.result.then(
            (data: any) => {
                if (data) {
                    if (this.scenariosSelected.length > 0)
                        this.scenariosSelected = this.scenariosSelected.concat(
                            data
                        );
                    else {
                        this.scenariosSelected = data;
                    }
                    this.posScenarios.emit({
                        indexEdit: this.indexScenarioEdit,
                        indexActive: this.indexScenarioActive,
                    });
                    this.returnScenarios.emit(this.scenariosSelected);
                }
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    /**
     * Load scenarios from db
     */
    onLoadScenarios(): void {
        const modal = this.modal.open(ScenariosModalComponent);

        modal.result.then(
            (data: any) => {
                if (data) {
                    if (this.scenariosSelected.length > 0)
                        this.scenariosSelected = this.scenariosSelected.concat(
                            data
                        );
                    else this.scenariosSelected = data;
                    this.loadInfoScenario();
                    this.initFormGroup();
                    this.returnScenarios.emit(this.scenariosSelected);
                }
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    onSaveScenario() {}

    isActiveScenario(index: number): boolean {
        return index === this.indexScenarioActive;
    }

    isScenarioEdit(index: number): boolean {
        return index === this.indexScenarioEdit;
    }

    /**
     * Activate scenario
     * @param index
     */
    onActiveScenario(index: number): void {
        this.indexScenarioActive = index;
        this.posScenarios.emit({
            indexEdit: this.indexScenarioEdit,
            indexActive: this.indexScenarioActive,
        });
        this.loadInfoScenario();
        this.initFormGroup();
        this.returnScenarios.emit(this.scenariosSelected);
    }

    /**
     * Edit scenario
     * @param index
     */
    onEditScenario(index: number): void {
        this.indexScenarioEdit = index;
        this.posScenarios.emit({
            indexEdit: this.indexScenarioEdit,
            indexActive: this.indexScenarioActive,
        });
        this.loadInfoScenario();
        this.initFormGroup();
        this.returnScenarios.emit(this.scenariosSelected);
    }

    /**
     * Delete scenario
     * @param index
     */
    onDelete(index: number): void {
        this.scenariosSelected.splice(index, 1);
        this.posScenarios.emit({
            indexEdit: this.indexScenarioEdit,
            indexActive: this.indexScenarioActive,
        });

        this.loadInfoScenario();
        this.initFormGroup();
        this.returnScenarios.emit(this.scenariosSelected);
    }

    /**
     * Load information from scenarios selected.
     * @param scenarios - Scenarios selected
     */
    private loadInfoScenario(scenarios: any[] = null): void {
        if (scenarios) this.scenariosSelected = scenarios;

        this.activeScenario = this.scenariosSelected[this.indexScenarioEdit];

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

        if (this.activeScenario)
            this.simulationService
                .getSimulationsByScenario(this.activeScenario.id_scenario)
                .subscribe(
                    (data) => {
                        this.simulationsNumber = data.total;
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
    }

    /**
     * Init reactive form
     */
    private initFormGroup() {
        this.formGroup = this.fb.group({
            temp: [this.tempValue ? this.tempValue : 0, Validators.required],
            cardiacCycle: [
                this.cardiacCycleValue ? this.cardiacCycleValue : 0,
                Validators.required,
            ],
            respirationRate: [
                this.repRateValue ? this.repRateValue : 0,
                Validators.required,
            ],
            arrhythmias: this.fb.array([]),
            pathologies: this.fb.array([]),
            medications: this.fb.array([]),
        });

        this.setArrhythmias();
        this.setMedications();
        this.setPathologies();
    }

    addRowMedication(medication: any = null): void {
        const control = this.formGroup.get("medications") as FormArray;
        if (medication) {
            control.push(this.initiateMedicationForm(medication));
        } else control.push(this.initiateMedicationForm());
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
                        medication: med.medication ? med.medication : null,
                    });
            });
        }
    }

    onSaveChanges() {
        if (this.formGroup.valid) {
            if (this.simulationsNumber > 1) {
                const modal = this.modal.open(ConfirmModalComponent);
                modal.componentInstance.setTitle(
                    `The scenario ${this.activeScenario.name} is involved in another simulation.`
                );
                modal.componentInstance.setContent("Do you want to overwrite?");

                modal.result.then(
                    (result) => {
                        if (result) {
                            this.saveScenarioInfo();
                        }
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
            } else {
                this.saveScenarioInfo();
            }
        }
    }

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
            this.scenariosService
                .updateById(this.activeScenario.id_scenario, {
                    name: this.activeScenario.name,
                    description: this.activeScenario.description,
                    arrhythmias: arrhythmias,
                    medications: this.formGroup.value.medications,
                    pathologies: pathologies,
                })
                .subscribe(
                    () => {
                        this.toast.toastrConfig.timeOut = 1000;
                        this.toast.toastrConfig.positionClass =
                            "toast-bottom-left";
                        this.toast.toastrConfig.closeButton = true;
                        this.toast.success("Scenario saved!");
                    },
                    (error: any) => {
                        this.toast.toastrConfig.timeOut = 1000;
                        this.toast.toastrConfig.positionClass =
                            "toast-bottom-left";
                        this.toast.toastrConfig.closeButton = true;
                        this.toast.error("Error saving scenarios");
                    }
                );
        }
    }

    private setPathologies(): void {
        if (this.pathologiesScenario.length > 0) {
            this.pathologiesScenario.forEach((pat) => {
                this.addRowPathology(pat);
            });
        }
    }

    private initiatePathologyForm(pathology: any = null): AbstractControl {
        return this.fb.group({
            pathology: [pathology ? pathology : ""],
        });
    }

    private initiateArrhythmiaForm(arrhythmia: any = null): AbstractControl {
        return this.fb.group({
            arrhythmia: [arrhythmia ? arrhythmia : ""],
        });
    }
}
