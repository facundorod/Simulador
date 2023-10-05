import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhysiologicalParameterEnum } from '@app/shared/enum/physiologicalParameterEnum';
import { AnimalSpeciesI } from '@app/shared/models/animal-speciesI';
import { InputParameterI } from '@app/shared/models/inputParameters';
import { PaginatedItemI } from '@app/shared/models/paginatedItemsI';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { ScenarioI } from '@app/shared/models/scenarioI';
import { ScenarioParamsI } from '@app/shared/models/scenarioParamsI';
import { SimulationI } from '@app/shared/models/simulationI';
import { ParametersRangesComponent } from '../../components/parameters-ranges/parameters-ranges.component';
import { AnimalSpeciesService } from '../../services/animalSpecies.service';
import { ScenariosComponent } from '../scenarios/scenarios.component';
import { CurvesPreviewComponent } from '@app/modules/monitor/components/curves-preview/curves-preview.component';
import { CurvesService } from '../../services/curves.service';

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
    @ViewChild('parametersRanges') parametersSelectors: ParametersRangesComponent;
    @ViewChildren('curvesPreview') curvesPreviews: QueryList<CurvesPreviewComponent>;

    muteAlarms: any;
    private indexSimulationActive: number;
    private activeScenario: ScenarioI;
    private scenariosSimulation: ScenarioI[] = [];
    private inputParameters: InputParameterI;
    private parametersWithCurves: PhysiologicalParamaterI[];

    constructor(
        private fb: FormBuilder,
        private animalService: AnimalSpeciesService,
        private curvesService: CurvesService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.animalSpecies = [];
        this.inputParameters = {
            breathRate: 0,
            heartRate: 0,
            spO2: 0,
            temperature: 0
        }
        this.indexSimulationActive = 0;
        this.activeAnimalSpecie = null;
        this.initFormSimulation();
        this.getAnimalSpeciesFromServer();
    }

    existCurves(): any {
        throw new Error('Method not implemented.');
    }
    public onApplyChanges(): void {
        // localStorage.setItem('scenarioState', JSON.stringify(this.monitorState))
        // this.saveParameterInfo();
        // this.updateState();
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
        this.scenariosSimulation = scenarios;
        if (!this.activeScenario || this.activeScenario !== this.scenariosSimulation[this.indexSimulationActive])
            this.activeScenario = this.scenariosSimulation[this.indexSimulationActive];
        this.setParameterInformation();
    }

    public getScenariosSimulation(): ScenarioI[] {
        return this.scenariosSimulation;
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

    public setNewColorLine(newColorLine: string, index: number) {
        this.parametersWithCurves[index].colorLine = newColorLine;
    }

    private setParameterInformation(): void {
        if (this.activeScenario) {
            this.parametersWithCurves = this.activeScenario.parameters.filter((par: PhysiologicalParamaterI) => {
                return par.showInMonitor
            }).sort((par1: PhysiologicalParamaterI, par2: PhysiologicalParamaterI) => {
                return par1.order - par2.order
            }).map((par: PhysiologicalParamaterI) => {
                let normalizedDataset: [number, number][] = []
                if (par.source === PhysiologicalParameterEnum.HeartSource) {
                    normalizedDataset = this.curvesService.normalizeDataset(par.curve, this.inputParameters.heartRate, par.source)
                } else {
                    normalizedDataset = this.curvesService.normalizeDataset(par.curve, this.inputParameters.breathRate, par.source)
                }
                delete par.curve
                return {
                    curve: this.curvesService.extendCurves(normalizedDataset),
                    ...par
                }
            })
            this.activeScenario.parameters.forEach((parameter: PhysiologicalParamaterI) => {
                switch (parameter.label.toUpperCase()) {
                    case PhysiologicalParameterEnum.HeartRate:
                        this.inputParameters.heartRate = parameter.value;
                        break;
                    case PhysiologicalParameterEnum.OxygenSaturation:
                        this.inputParameters.spO2 = parameter.value;
                        break;
                    case PhysiologicalParameterEnum.RespirationRate:
                        this.inputParameters.breathRate = parameter.value;
                        break;
                    case PhysiologicalParameterEnum.Temperature:
                        this.inputParameters.temperature = parameter.value;
                        break;
                    default:
                        break;
                }
            })
            this.parametersSelectors.setParametersInformation(this.inputParameters);
        }
    }

    public getParameterInformation(): InputParameterI {
        return this.inputParameters;
    }

    public connectedSimulation(): boolean {
        return this.activeScenario !== null && this.activeScenario !== undefined;
    }

    public setHeartRate(newHR: number): void {
        this.inputParameters.heartRate = newHR;
    }

    public setTemperature(newTemp: number): void {
        this.inputParameters.temperature = newTemp;
    }
    public setSPO2(newSPO2: number): void {
        this.inputParameters.temperature = newSPO2;
    }
    public setBreathRate(newBR: number): void {
        this.inputParameters.breathRate = newBR;
    }

    public getParametersWithCurves(): PhysiologicalParamaterI[] {
        return this.parametersWithCurves;
    }

    public setNewDataset(newDataset: [number, number][] | any, index: number) {
        const curvesPreviewItem: CurvesPreviewComponent = this.curvesPreviews.toArray()[index];
        if (curvesPreviewItem)
            curvesPreviewItem.updateDataset(newDataset);
    }
}
