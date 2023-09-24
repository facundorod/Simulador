import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimalSpeciesService } from '../../services/animalSpecies.service';
import { AnimalSpeciesI } from '@app/shared/models/animal-speciesI';
import { SimulationI } from '@app/shared/models/simulationI';
import { PaginatedItemI } from '@app/shared/models/paginatedItemsI';
import { ScenarioParamsI } from '@app/shared/models/scenarioParamsI';
import { ScenariosComponent } from '../scenarios/scenarios.component';

@Component({
    selector: 'app-panel2',
    templateUrl: './panel2.component.html',
    styleUrls: ['./panel2.component.css']
})
export class Panel2Component implements OnInit {
    private simulationForm: FormGroup;
    private animalSpecies: AnimalSpeciesI[];
    private loading: boolean;
    private activeAnimalSpecie: AnimalSpeciesI;
    @Input() simulation: SimulationI;
    @ViewChild('scenarios') scenarios: ScenariosComponent;
    muteAlarms: any;
    private indexSimulationActive: number;
    private activeScenario: ScenarioParamsI;
    private _scenariosSimulation: ScenarioParamsI[] = [];



    constructor(
        private fb: FormBuilder,
        private animalService: AnimalSpeciesService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.animalSpecies = [];
        this.activeAnimalSpecie = null;
        this.initFormSimulation();
        this.getAnimalSpeciesFromServer();
    }

    existCurves(): any {
        throw new Error('Method not implemented.');
    }
    applyChanges() {
        throw new Error('Method not implemented.');
    }
    onPlaySimulation() {
        throw new Error('Method not implemented.');
    }
    onPauseSimulation() {
        throw new Error('Method not implemented.');
    }
    configureNIBP() {
        throw new Error('Method not implemented.');
    }
    resetSimulation() {
        throw new Error('Method not implemented.');
    }
    onMuteAlarms() {
        throw new Error('Method not implemented.');
    }
    onUnmuteAlarms() {
        throw new Error('Method not implemented.');
    }
    onStopSimulation() {
        throw new Error('Method not implemented.');
    }

    private initFormSimulation(): void {
        this.simulationForm = this.fb.group({
            simulationName: [
                this.simulation ? this.simulation.name : '',
                Validators.required,
            ],
            simulationDescription: [
                this.simulation ? this.simulation.description : '',
                Validators.required,
            ],
            animalSpecie: [
                this.activeAnimalSpecie ? this.activeAnimalSpecie : '',
                Validators.required,
            ],
        });
        this.onValueChanges();
    }

    public getSimulationForm(): FormGroup {
        return this.simulationForm;
    }



    public getActiveAnimal(): AnimalSpeciesI {
        return this.activeAnimalSpecie;
    }

    public getAnimalSpecies(): AnimalSpeciesI[] {
        return this.animalSpecies;
    }

    private getAnimalSpeciesFromServer(): void {
        this.animalService.list().subscribe((animals: PaginatedItemI<AnimalSpeciesI>) => {
            if (animals)
                this.animalSpecies = animals.data;
            this.loading = false;
        })
    }

    public isLoading(): boolean {
        return this.loading;
    }

    public getPosScenarios(pos: { indexActive: number }): void {
        if (this.indexSimulationActive != pos.indexActive) {
            this.indexSimulationActive = pos.indexActive;
            this.activeScenario = this.scenariosSimulation[this.indexSimulationActive];
        }
    }

    public getScenarios(scenarios: ScenarioParamsI | any): void {
        this.scenarioSimulation = scenarios;
        if (this.activeScenario !== this.scenariosSimulation[this.indexSimulationActive])
            this.activeScenario = this.scenariosSimulation[this.indexSimulationActive];

    }

    public get scenariosSimulation(): ScenarioParamsI[] {
        return this._scenariosSimulation;
    }

    public set scenarioSimulation(scenario: ScenarioParamsI) {
        this.scenarioSimulation = scenario;
    }

    private onValueChanges(): void {
        this.simulationForm.get('animalSpecie').valueChanges.subscribe((val: AnimalSpeciesI) => {
            this.scenarios.setAnimal(val);
            if (val && val.id_as !== this.activeAnimalSpecie?.id_as) {
                this.scenarios.clearScenarios();
                this.activeAnimalSpecie = val;
                this.activeScenario = null;
            }
        });
    }
}
