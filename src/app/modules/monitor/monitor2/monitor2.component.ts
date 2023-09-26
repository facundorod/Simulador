import { AfterViewInit, Component, OnInit, TrackByFunction, ViewChildren } from '@angular/core';
import { ChartComponent } from '../components/chart/chart.component';
import { MonitorService } from '../services/monitor.service';
import { ParameterInfoI } from '@app/shared/models/parameterInfoI';
import { MonitorStateI } from '@app/shared/models/MonitorStateI';
import { CurvesInformationI } from '@app/shared/models/CurvesInformationI';
import { PhysiologicalParameterSourceEnum } from '@app/shared/enum/physiologicalParameterSourceEnum';

@Component({
    selector: 'app-monitor2',
    templateUrl: './monitor2.component.html',
    styleUrls: ['./monitor2.component.css']
})
export class Monitor2Component implements OnInit, AfterViewInit {
    @ViewChildren('chartComponent') chartComponents: ChartComponent[];
    private monitorState: MonitorStateI;
    private intervalHeartCurves: NodeJS.Timeout;
    private intervalBreathCurves: NodeJS.Timeout;
    constructor(private monitorService: MonitorService) {
    }
    ngAfterViewInit(): void {
        this.checkLocalStorage()
    }

    ngOnInit(): void {
    }

    private checkLocalStorage(): void {
        this.monitorService.getMonitorState().subscribe((newState: MonitorStateI) => {
            if (newState) {
                this.monitorState = newState;
                this.updateParametersValues();
                this.updateCurvesDataset();
                this.runSimulation();
            } else {
                if (this.monitorState) this.monitorState.simulationStatus = 'OFF'
                clearInterval(this.intervalBreathCurves)
                clearInterval(this.intervalHeartCurves)
            }
        })
    }

    private runSimulation(): void {
        if (this.intervalBreathCurves) clearInterval(this.intervalBreathCurves)
        if (this.intervalHeartCurves) clearInterval(this.intervalHeartCurves)
        if (this.monitorState.simulationStatus === 'RUNNING') {
            this.simulationBreathCurves();
            this.simulationHeartCurves();
        }
    }

    private updateCurvesDataset(): void {
        this.chartComponents.forEach((chartComponent: ChartComponent, index: number) => {
            const curveConfiguration: CurvesInformationI = this.monitorState.curvesInformation[index];
            chartComponent.updateDataset(curveConfiguration.dataset);
        })
    }

    private simulationBreathCurves(): void {
        this.intervalBreathCurves = setInterval(() => {
            this.updateBreathRateCurves();
        }, this.monitorState.breathSamplingRate)
    }

    private updateBreathRateCurves(): void {
        this.chartComponents.forEach((chartComponent: ChartComponent, index: number) => {
            const curveConfiguration: CurvesInformationI = this.monitorState.curvesInformation[index];
            if (curveConfiguration.source === PhysiologicalParameterSourceEnum.Breath) {
                chartComponent.updateRealTimeDataset();
            }
        })
    }

    private updateHeartRateCurves(): void {
        this.chartComponents.forEach((chartComponent: ChartComponent, index: number) => {
            const curveConfiguration: CurvesInformationI = this.monitorState.curvesInformation[index];
            if (curveConfiguration.source === PhysiologicalParameterSourceEnum.Heart) {
                chartComponent.updateRealTimeDataset();
            }
        })
    }

    private simulationHeartCurves(): void {
        this.intervalHeartCurves = setInterval(() => {
            this.updateHeartRateCurves()
        }, this.monitorState.heartSamplingRate)
    }


    private updateParametersValues(): void {
        const parametersInformation: ParameterInfoI = JSON.parse(localStorage.getItem('parameterState'));
        this.monitorState.parameterInformation = parametersInformation;
    }

    public getAnimalName(): string {
        return this.monitorState.scenario.animalName;
    }

    public getCurvesToShowInMonitor(): CurvesInformationI[] {
        return this.monitorState.curvesInformation.filter((curveData: CurvesInformationI) => {
            return curveData.showCurves
        })
    }

    // Define la función trackByFn para realizar un seguimiento de los elementos por su ID
    public trackByFn(index: number, item: CurvesInformationI): number {
        return item.id_pp;
    }

    public getScenarioDescription(): string {
        return this.monitorState.scenario.description;
    }

    public isPausedSimulation(): boolean {
        return this.monitorState.simulationStatus === 'PAUSED'
    }

    public isMonitorConnected(): boolean {
        return this.monitorState && this.monitorState.simulationStatus !== 'OFF'
    }

}
