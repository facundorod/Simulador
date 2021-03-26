import { SimulationService } from "./../../../simulation/services/simulation.service";
import { ToastrService } from "ngx-toastr";
import { Component, Input, OnInit } from "@angular/core";

// Service
import { AnimalSpeciesService } from "./../../services/animalSpecies.service";

// Models
import { PathologyI } from "@models/pathologyI";
import { MedicationI } from "@models/medicationI";
import { ArrhythmiaI } from "@models/arrhythmiaI";
import { AnimalSpeciesI } from "@models/animal-speciesI";
import { BaseComponent } from "@app/shared/components/base.component";
import { FormBuilder, Validators } from "@angular/forms";
import { CurvesService } from "../../services/curves.service";
import { CurvesI } from "@app/shared/models/curvesI";
import { PhysiologicalParamaterI } from "@app/shared/models/PhysiologicalParamaterI";

enum PhysiologicalParamaters {
    SP02 = 'SP02',

}
@Component({
    selector: "app-panel",
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.css"],
})
export class PanelComponent extends BaseComponent implements OnInit {



    editScenario: any = {}; // Scenario active for edit
    activeScenario: any; // Scenario active for simulation
    simulationsNumber: number = 0; // Number of simulation's scenario.

    scenariosSimulation: any[] = [];
    animalSpecies: any[] = []; // Animal Species to populate the dropdown
    animalSpecie: any = {}; // Animal Specie from simulation
    simulation: any = {}; // Simulation from localStorage
    indexActive: number = 0; // Index for scenario edit Active
    indexSimulationActive: number = 0; // Index for scenario simulation Active
    private curves: any[]; // Curves for scenario and animalSpecie selected

    // CURVES //
    capnographyCurve: CurvesI[]; // Curve to model capnography
    plethCurve: CurvesI[]; // Curve to model plethysmography
    ecgCurve: CurvesI[]; // Curve to model ecgCurve
    bloodPressureCurve: CurvesI[]; // Curve to model blood Pressure

    constructor(
        private animalSpecieService: AnimalSpeciesService,
        private fb: FormBuilder,
        private toast: ToastrService,
        private simulationService: SimulationService,
        private curvesService: CurvesService
    ) {
        super();
    }

    ngOnInit(): void {
        this.setSubmitForm(false);
        this.setLoading(true);
        this.loadData();
        this.initFormGroup();
        this.onLoadCurves();
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
                // If the simulation has scenarios, the first will be the active for simulation
                this.activeScenario = this.scenariosSimulation[0];
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
     * Load curves for scenario active for simulation and for animalSpecie selected
     */
    public onLoadCurves() {
        if (this.activeScenario && this.formGroup.value.animalSpecie != null) {
            this.curvesService
                .findAll({
                    animalSpecie: this.formGroup.value.animalSpecie.id_as,
                    scenario: this.activeScenario.id_scenario,
                })
                .subscribe(
                    (curves: any) => {
                        if (curves.data.length > 0) {
                            this.curves = curves.data;
                            this.setCurves();
                        }
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
        } else this.curves = [];
    }

    /**
     * Loop through array of curves and set each one
     */
    private setCurves() {
        this.curves.forEach((cv: any) => {
            const physiologicalParameter: PhysiologicalParamaterI =
                cv.ppPerAs.physiologicalParameter;

            if (physiologicalParameter.label.toLowerCase() === )
        });
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
        // debugger;
        this.scenariosSimulation = scenarios;
        this.editScenario = this.scenariosSimulation[this.indexActive];
        this.activeScenario = this.scenariosSimulation[
            this.indexSimulationActive
        ];
        this.onLoadCurves();
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
