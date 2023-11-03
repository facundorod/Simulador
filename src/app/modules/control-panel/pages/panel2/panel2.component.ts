import { Component, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhysiologicalParameterEnum } from '@app/shared/enum/physiologicalParameterEnum';
import { AnimalSpeciesI } from '@app/shared/models/animal-speciesI';
import { InputParameterI } from '@app/shared/models/inputParameters';
import { PaginatedItemI } from '@app/shared/models/paginatedItemsI';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { ScenarioI } from '@app/shared/models/scenarioI';
import { SimulationI } from '@app/shared/models/simulationI';
import { ParametersRangesComponent } from '../../components/parameters-ranges/parameters-ranges.component';
import { AnimalSpeciesService } from '../../services/animalSpecies.service';
import { CurvesPreviewComponent } from '@app/modules/monitor/components/curves-preview/curves-preview.component';
import { CurvesService } from '../../services/curves.service';
import { PhysiologicalParameterSourceEnum } from '@app/shared/enum/physiologicalParameterSourceEnum';
import { curvesConfiguration } from '@app/shared/constants/curves';
import { LOCALSTORAGEITEMS } from '@app/shared/constants/localStorage';
import { MonitorSound, MonitorStateI } from '@app/shared/models/MonitorStateI';
import { v4 } from 'uuid';
import { SimulationStatusEnum } from '@app/shared/enum/simulationStatusEnum';
import { BatteryStatusEnum } from '@app/shared/enum/batteryStatusEnum';
import { ParameterHelper } from '../../helpers/parameterHelper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NibpComponent } from '../../modals/nibp/nibp.component';
import { NIBPTIME } from '@app/shared/constants/simulation';
import { ScenarioService } from '../../services/scenario.service';
import { MonitorSoundsComponent } from '../../modals/monitor-sounds/monitor-sounds.component';

@Component({
    selector: 'app-panel2',
    templateUrl: './panel2.component.html',
    styleUrls: ['./panel2.component.css'],
})
export class Panel2Component implements OnInit, OnDestroy {

    private simulationForm: FormGroup;
    private animalSpecies: AnimalSpeciesI[];
    private activeAnimalSpecie: AnimalSpeciesI;
    private simulationStatus: SimulationStatusEnum = SimulationStatusEnum.RUNNING;
    private batteryStatus: BatteryStatusEnum = BatteryStatusEnum.NORMAL;

    @Input() simulation: SimulationI;
    @ViewChild('parametersRanges') parametersSelectors: ParametersRangesComponent;
    @ViewChildren('curvesPreview') curvesPreviews: QueryList<CurvesPreviewComponent>;

    private clinicScenario: ScenarioI;
    private inputParameters: InputParameterI;
    private originalParametersWithCurves: PhysiologicalParamaterI[];
    private currentParametersWithCurves: PhysiologicalParamaterI[];
    private monitorState: MonitorStateI = null;
    private monitorSound: MonitorSound;
    private timeNIBP: number;
    private startNIBPInmediatly: boolean = false;
    public isLoadingScenario: boolean = false;
    public isLoadingAnimals: boolean = true;

    constructor(
        private fb: FormBuilder,
        private animalService: AnimalSpeciesService,
        private scenarioService: ScenarioService,
        private curvesService: CurvesService,
        private modalRef: NgbModal
    ) { }


    ngOnInit(): void {
        localStorage.removeItem(LOCALSTORAGEITEMS.SIMULATION)
        this.animalSpecies = [];
        this.inputParameters = {
            breathRate: 0,
            heartRate: 0,
            spO2: 0,
            temperature: 0,
            endTidalCO2: 0,
            ibpDiastolic: 0,
            ibpMean: 0,
            startNIBP: false,
            ibpSystolic: 0,
            inspirationCO2: 0,
            timeNIBP: 5
        }
        this.monitorSound = {
            alarms: true,
            batterySound: true,
            heartFreqSound: true
        }
        this.activeAnimalSpecie = null;
        this.initFormSimulation();
        this.getAnimalSpeciesFromServer();
    }

    ngOnDestroy(): void {
        localStorage.removeItem(LOCALSTORAGEITEMS.SIMULATION)
    }


    public onApplyChanges(): void {
        this.monitorState = {
            scenario: {
                animalName: this.activeAnimalSpecie.name,
                description: this.simulationForm.get('simulationName').value,
                name: this.activeAnimalSpecie.name
            },
            parametersWithCurves: this.currentParametersWithCurves,
            nibpMeasurement: {
                time: this.timeNIBP,
                startInmediatly: this.startNIBPInmediatly
            },
            id: v4(),
            simulationStatus: this.simulationStatus,
            batteryStatus: this.batteryStatus,
            soundStatus: this.monitorSound,
            parameterInformation: this.inputParameters,
        }
        localStorage.setItem(LOCALSTORAGEITEMS.SIMULATION, JSON.stringify(this.monitorState))
    }

    public onPlaySimulation() {
        this.simulationStatus = SimulationStatusEnum.RUNNING;
        this.onApplyChanges();
    }
    public onPauseSimulation(): void {
        this.simulationStatus = SimulationStatusEnum.PAUSED;
        this.onApplyChanges();
    }

    public configureNIBP(): void {
        const modal = this.modalRef.open(NibpComponent, { size: 'm', windowClass: 'modal-medium' });
        modal.componentInstance.setInitialValue(NIBPTIME);
        modal.result.then((nibpSettings: { timeNibp: number, startNow: boolean }) => {
            this.timeNIBP = nibpSettings.timeNibp;
            this.startNIBPInmediatly = nibpSettings.startNow;
            this.monitorState.nibpMeasurement = {
                startInmediatly: nibpSettings.startNow,
                time: nibpSettings.timeNibp
            }
            this.onApplyChanges();
            this.startNIBPInmediatly = false;
        })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    resetSimulation() {
        this.setParameterInformation();
    }
    onMuteAlarms() {
        const modal = this.modalRef.open(MonitorSoundsComponent, { size: 'm', windowClass: 'modal-medium' });
        modal.componentInstance.setMonitorSound(this.monitorSound);

        modal.result.then((monitorSound: MonitorSound) => {
            if (monitorSound) {
                this.monitorSound = monitorSound;
                this.onApplyChanges();
             }
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    public onStopSimulation() {
        this.simulationStatus = SimulationStatusEnum.STOPPED;
        this.onApplyChanges();
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
            this.isLoadingAnimals = false;
        })
    }


    private onValueChanges(): void {
        this.simulationForm.get('animalSpecie').valueChanges.subscribe((val: AnimalSpeciesI) => {
            if (val && val.id_as !== this.activeAnimalSpecie?.id_as) {
                this.activeAnimalSpecie = val;
                this.getNormalScenarioFromAnimal(val.id_as);
            }
        });
    }

    public setHeight({ newHeight, previousHeight }, index: number): void {
        const currentParameter = this.currentParametersWithCurves[index];
        const factor: number = 1 + (newHeight / 100);
        const newCurve = CurvesService.updateMaxY(currentParameter.curve, previousHeight, undefined, factor);
        const value: number = ParameterHelper.isHeartSource(currentParameter) ? this.inputParameters.heartRate : this.inputParameters.breathRate;
        this.currentParametersWithCurves[index].normalizedCurve = this.curvesService.normalizeDataset(newCurve, value, currentParameter.source)
    }

    private getNormalScenarioFromAnimal(idAs: number): void {
        this.isLoadingScenario = true;
        this.scenarioService.getNormalScenario(idAs).subscribe((normalScenario: ScenarioI) => {
            if (normalScenario) {
                this.clinicScenario = normalScenario;
                this.setParameterInformation();
            }
            setTimeout(() => {
                this.isLoadingScenario = false;
            }, 100)
        })
    }

    public disconnectParameter(disconnect: boolean, index: number) {
        const currentParameter: PhysiologicalParamaterI = this.currentParametersWithCurves[index]
        if (disconnect && !currentParameter.disconnected) {
            const newCurve: [number, number][] = [[0, 0]]
            const value: number = ParameterHelper.isHeartSource(currentParameter) ? this.inputParameters.heartRate : this.inputParameters.breathRate;
            this.currentParametersWithCurves[index].normalizedCurve = this.curvesService.normalizeDataset(newCurve, value, currentParameter.source)
            currentParameter.disconnected = true;
        }

        if (!disconnect && currentParameter.disconnected) {
            const value: number = ParameterHelper.isHeartSource(currentParameter) ? this.inputParameters.heartRate : this.inputParameters.breathRate;
            this.currentParametersWithCurves[index].normalizedCurve =
                this.curvesService.normalizeDataset(this.currentParametersWithCurves[index].curve, value, currentParameter.source);
            currentParameter.disconnected = false;
        }
    }

    public setNewColorLine(newColorLine: string, index: number) {
        this.originalParametersWithCurves[index].colorLine = newColorLine;
    }


    private setParameterInformation(): void {
        if (this.clinicScenario) {
            this.setParametersWithCurve();
            this.clinicScenario.parameters.forEach((parameter: PhysiologicalParamaterI) => {
                switch (parameter.label.toUpperCase()) {
                    case PhysiologicalParameterEnum.HeartRate:
                        this.inputParameters.heartRate = parameter.value;
                        break;
                    case PhysiologicalParameterEnum.OxygenSaturation:
                        this.inputParameters.spO2 = parameter.value;
                        break;
                    case PhysiologicalParameterEnum.Capnography:
                        this.inputParameters.breathRate = parameter.value;
                        this.inputParameters.endTidalCO2 = ParameterHelper.getEndTidalCO2(parameter);
                        this.inputParameters.inspirationCO2 = ParameterHelper.getInspirationCO2(parameter);
                        break;
                    case PhysiologicalParameterEnum.Temperature:
                        this.inputParameters.temperature = parameter.value;
                        break;
                    case PhysiologicalParameterEnum.InvasiveBloodPressure:
                        this.inputParameters.ibpDiastolic = ParameterHelper.getDiastolicPressure(parameter);
                        this.inputParameters.ibpSystolic = ParameterHelper.getSystolicPressure(parameter);
                        this.inputParameters.ibpMean =
                            ParameterHelper.getMeanPressure(this.inputParameters.ibpDiastolic, this.inputParameters.ibpSystolic);
                        break;
                    default:
                        break;
                }
            })
            this.parametersSelectors.setParametersInformation(this.inputParameters);
        }
    }

    public hideParameter(hide: boolean, index: number): void {
        this.currentParametersWithCurves[index].showCurves = hide;
    }


    private setParametersWithCurve() {
        this.originalParametersWithCurves = this.clinicScenario.parameters.filter((par: PhysiologicalParamaterI) => {
            return par.showInMonitor;
        }).sort((par1: PhysiologicalParamaterI, par2: PhysiologicalParamaterI) => {
            return par1.order - par2.order;
        }).map((par: PhysiologicalParamaterI) => {
            let normalizeCurve: [number, number][] = this.curvesService.normalizeCurveDataset(par.curve);
            par.curve = normalizeCurve;
            let normalizedDataset: [number, number][] = this.normalizeCurves(par);
            if (par.showInMonitor) {
                par.showCurves = true;
            }
            return {
                curve: normalizeCurve,
                normalizedCurve: normalizedDataset,
                ...par
            };
        });

        this.currentParametersWithCurves = [...this.originalParametersWithCurves];
    }

    private normalizeCurves(par: PhysiologicalParamaterI): [number, number][] {
        let normalizedDataset: [number, number][] = [];
        if (par.source === PhysiologicalParameterSourceEnum.Heart) {
            normalizedDataset = this.curvesService.normalizeDataset(par.curve, this.inputParameters.heartRate, PhysiologicalParameterSourceEnum.Heart);
        } else {
            normalizedDataset = this.curvesService.normalizeDataset(par.curve, this.inputParameters.breathRate, PhysiologicalParameterSourceEnum.Breath);
        }
        return normalizedDataset;
    }

    public getParameterInformation(): InputParameterI {
        return this.inputParameters;
    }

    public connectedSimulation(): boolean {
        return this.clinicScenario !== null && this.clinicScenario !== undefined;
    }

    public setHeartRate(newHR: number): void {
        this.inputParameters.heartRate = newHR;
        this.currentParametersWithCurves.forEach((par: PhysiologicalParamaterI, i: number) => {
            if (par.source === PhysiologicalParameterSourceEnum.Heart)
                this.setNewDataset({ curve: par.curve, normalized: this.normalizeCurves(par) }, i);
        });
    }

    public setTemperature(newTemp: number): void {
        this.inputParameters.temperature = newTemp;
    }
    public setSPO2(newSPO2: number): void {
        this.inputParameters.temperature = newSPO2;
    }
    public setBreathRate(newBR: number): void {
        this.inputParameters.breathRate = newBR;
        this.currentParametersWithCurves.forEach((par: PhysiologicalParamaterI, i: number) => {
            if (par.source === PhysiologicalParameterSourceEnum.Breath)
                this.setNewDataset({ curve: par.curve, normalized: this.normalizeCurves(par) }, i);
        })
    }

    public getSamplingRate(par: PhysiologicalParamaterI) {
        if (par.source === PhysiologicalParameterSourceEnum.Breath)
            return CurvesService.getBreathSamplingRate(this.inputParameters.breathRate)
        return curvesConfiguration.SAMPLING_RATE;
    }

    public getParametersWithCurves(): PhysiologicalParamaterI[] {
        return this.currentParametersWithCurves;
    }

    public setInspirationCO2(newValue: { newInspirationCO2: number, onlyUpdateValue: boolean }, index: number): void {
        if (!newValue.onlyUpdateValue) {
            const newCurve: [number, number][] =
                CurvesService.updateInspirationCO2(this.currentParametersWithCurves[index].curve, this.inputParameters.inspirationCO2, newValue.newInspirationCO2);
            this.setNewDataset({
                curve: newCurve,
                normalized: this.curvesService.normalizeDataset(newCurve, this.inputParameters.breathRate, PhysiologicalParameterSourceEnum.Breath)
            }, index)
        }
        this.inputParameters.inspirationCO2 = newValue.newInspirationCO2;
    }

    public setEndTidalCO2(newValue: { newEndTidalCO2: number, onlyUpdateValue: boolean }, index: number): void {
        if (!newValue.onlyUpdateValue) {
            const newCurve: [number, number][] =
                CurvesService.updateEndTidalCO2(this.currentParametersWithCurves[index].curve, this.inputParameters.endTidalCO2, newValue.newEndTidalCO2);
            this.setNewDataset({
                curve: newCurve,
                normalized: this.curvesService.normalizeDataset(newCurve, this.inputParameters.breathRate, PhysiologicalParameterSourceEnum.Breath)
            }, index)
        }
        this.inputParameters.endTidalCO2 = newValue.newEndTidalCO2;
    }

    public setIbpSystolic(newValue: { newibpSystolic: number, onlyUpdateValue: boolean }, index: number): void {
        if (!newValue.onlyUpdateValue) {
            const newCurve: [number, number][] = CurvesService.updateIbpSystolic(this.currentParametersWithCurves[index].curve, this.inputParameters.ibpSystolic, newValue.newibpSystolic);
            this.setNewDataset({
                curve: newCurve,
                normalized: this.curvesService.normalizeDataset(newCurve, this.inputParameters.heartRate, PhysiologicalParameterSourceEnum.Heart)
            }, index)
        }
        this.inputParameters.ibpMean =
            ParameterHelper.getMeanPressure(this.inputParameters.ibpDiastolic, newValue.newibpSystolic);
        this.inputParameters.ibpSystolic = newValue.newibpSystolic;
    }

    public setIbpDiastolic(newValue: { newibpDiastolic: number, onlyUpdateValue: boolean }, index: number): void {
        if (!newValue.onlyUpdateValue) {
            const newCurve: [number, number][] = CurvesService.updateIbpDiastolic(this.currentParametersWithCurves[index].curve, this.inputParameters.ibpDiastolic, newValue.newibpDiastolic);
            this.setNewDataset({
                curve: newCurve,
                normalized: this.curvesService.normalizeDataset(newCurve, this.inputParameters.heartRate, PhysiologicalParameterSourceEnum.Heart)
            }, index)
        }
        this.inputParameters.ibpMean =
            ParameterHelper.getMeanPressure(newValue.newibpDiastolic, this.inputParameters.ibpSystolic)
        this.inputParameters.ibpDiastolic = newValue.newibpDiastolic;
    }

    public getMaxYValue(parameter: PhysiologicalParamaterI) {
        return ParameterHelper.getMaxParameterValue(parameter);
    }


    public getMinYValue(parameter: PhysiologicalParamaterI) {
        return ParameterHelper.getMinParameterValue(parameter);
    }

    public setNewDataset(curves: {
        curve: [number, number][],
        normalized: [number, number][]
    }, index: number) {
        this.currentParametersWithCurves[index].curve = curves.curve;
        this.currentParametersWithCurves[index].normalizedCurve = curves.normalized;
    }
}
