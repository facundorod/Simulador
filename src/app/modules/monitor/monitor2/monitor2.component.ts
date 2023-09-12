import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AnimalSpeciesI } from '@app/shared/models/animal-speciesI';
import { ScenarioI } from '@app/shared/models/scenarioI';
import { ChartComponent } from '../components/chart/chart.component';
import { MonitorService } from '../services/monitor.service';
import { StatesI } from '@app/shared/models/stateI';
import { ParameterInfoI } from '@app/shared/models/parameterInfoI';
import { CurvesI } from '@app/shared/models/curvesI';
import { MonitorStateI } from '@app/shared/models/MonitorStateI';
import { CurvesInformationI } from '@app/shared/models/CurvesInformationI';
import { PhysiologicalParameterEnum } from '@app/shared/enum/PhysiologicalParameterEnum';

@Component({
    selector: 'app-monitor2',
    templateUrl: './monitor2.component.html',
    styleUrls: ['./monitor2.component.css']
})
export class Monitor2Component implements OnInit {
    @ViewChildren('chartComponent') chartComponents: ChartComponent[];
    private monitorState: MonitorStateI;
    private currentIndexFreqHeart: number;
    private currentIndexFreqBreath: number;
    private curvesData: CurvesInformationI[] = []

    private intervalHeartCurves: NodeJS.Timeout;
    private intervalBreathCurves: NodeJS.Timeout;
    constructor(private monitorService: MonitorService) {
        this.initVariables()
        this.checkLocalStorage()
    }

    ngOnInit(): void {
    }

    private checkLocalStorage(): void {
        this.monitorService.getMonitorState().subscribe((newState: MonitorStateI) => {
            if (newState) {
                this.monitorState = newState;
                this.curvesData = newState.curvesInformation;
                this.updateParametersValues();
                this.runSimulation();
            }
        })
    }

    private runSimulation(): void {
        this.simulationBreathCurves();
        this.simulationHeartCurves();
    }

    private simulationBreathCurves(): void {
        this.intervalBreathCurves = setInterval(() => {

        }, this.monitorState.breathSamplingRate)
    }

    private updateHeartRateCurves(): void {
        debugger
        if (this.monitorState.currentIndexHeart >= this.monitorState.totalPoints - 1) {
            clearInterval(this.intervalHeartCurves)
            this.monitorState.currentIndexHeart = 0;
        }
        this.chartComponents.forEach((chartComponent: ChartComponent, index: number) => {
            const curveConfiguration: CurvesInformationI = this.monitorState.curvesInformation[index];
            if (curveConfiguration.source === PhysiologicalParameterEnum.Heart) {
                const newPoints: [number, number] = curveConfiguration.dataset[this.monitorState.currentIndexHeart];
                chartComponent.addElementsToLabels(newPoints[0]);
                chartComponent.addElementsToDataset(newPoints[1]);
            }
        })
        this.monitorState.currentIndexHeart++;
    }

    private simulationHeartCurves(): void {
        this.intervalHeartCurves = setInterval(() => {
            this.updateHeartRateCurves()
        }, this.monitorState.heartSamplingRate)
    }

    private initVariables(): void {
        this.currentIndexFreqBreath = 0;
        this.currentIndexFreqHeart = 0;
        this.curvesData = [];
    }

    private updateParametersValues(): void {
        const parametersInformation: ParameterInfoI = JSON.parse(localStorage.getItem('parameterState'));
        this.monitorState.parameterInformation = parametersInformation;
    }

    public getAnimalName(): string {
        if (this.monitorState?.scenario) {
            return this.monitorState.scenario.animalName;
        }
    }


    public getCurvesData(): CurvesInformationI[] {
        return this.curvesData;
    }

    public getCurvesToShowInMonitor(): CurvesInformationI[] {
        return this.curvesData.filter((curveData: CurvesInformationI) => {
            return curveData.showCurves
        })
    }

    public getScenarioDescription(): string {
        return this.monitorState.scenario.description;
    }

    public isRunningSimulation(): boolean {
        if (this.monitorState) return true
        return false;
    }

}
