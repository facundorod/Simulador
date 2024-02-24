import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { PhysiologicalParameterSourceEnum } from '@app/shared/enum/physiologicalParameterSourceEnum';
import { SimulationStatusEnum } from '@app/shared/enum/simulationStatusEnum';
import { MonitorStateI } from '@app/shared/models/MonitorStateI';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { ChartComponent } from '../components/chart/chart.component';
import { MonitorService } from '../services/monitor.service';
import { CurvesService } from '@app/modules/control-panel/services/curves.service';
import { curvesConfiguration } from '@app/shared/constants/curves';
import { AudioPlayerService } from '@app/shared/services/audio-player.service';
import { ParameterHelper } from '@app/modules/control-panel/helpers/parameterHelper';
import { CurvesHelper } from '@app/modules/simulation/helpers/curvesHelper';

@Component({
    selector: 'app-monitor2',
    templateUrl: './monitor2.component.html',
    styleUrls: ['./monitor2.component.css']
})
export class Monitor2Component implements OnInit, AfterViewInit {
    @ViewChildren('chartComponent') chartComponents: ChartComponent[];
    private audioPlayerService: AudioPlayerService = new AudioPlayerService();
    private alarmPlayerService: AudioPlayerService = new AudioPlayerService();
    private curvesHelper: CurvesHelper = new CurvesHelper();
    private monitorState: MonitorStateI;
    private intervalHeartCurves: NodeJS.Timeout;
    private intervalBreathCurves: NodeJS.Timeout;
    private soundInterval: NodeJS.Timeout;
    private heartAttackAudioService: AudioPlayerService = new AudioPlayerService();
    constructor(private monitorService: MonitorService) {
    }

    ngAfterViewInit(): void {
        this.checkLocalStorage()
    }

    ngOnInit(): void {
        this.audioPlayerService.initSoundProvider('/assets/sounds/monitor.mp3', false, false, false);
        this.heartAttackAudioService.initSoundProvider('/assets/sounds/flatline.mp3', true, false, false);
        this.alarmPlayerService.initSoundProvider('/assets/sounds/alarmLimit.mp3', true, false, false);
    }

    public isFullScreen(): boolean {
        if (document.fullscreenElement) return true
        return false;
    }

    private checkLocalStorage(): void {
        this.monitorService.getMonitorState().subscribe((newState: MonitorStateI) => {
            if (newState) {
                this.monitorState = newState;
                this.updateCurvesDataset();
                this.runSimulation();
            } else {
                if (this.monitorState) this.monitorState.simulationStatus = SimulationStatusEnum.OFF
                clearInterval(this.soundInterval);
                clearInterval(this.intervalBreathCurves)
                clearInterval(this.intervalHeartCurves)
            }
        })
    }

    public openFullScreen(): void {
        const element: any = document.documentElement; // Elemento HTML principal
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari y Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        }
    }

    public exitFullScreen(): void {
        const element: any = document.documentElement; // Elemento HTML principal
        if (element.exitFullscreen) {
            document.exitFullscreen();
        } else if (element.mozCancelFullScreen) { // Firefox
            element.mozCancelFullScreen();
        } else if (element.webkitExitFullscreen) { // Chrome, Safari y Opera
            element.webkitExitFullscreen();
        } else if (element.msExitFullscreen) { // IE/Edge
            element.msExitFullscreen();
        }
    }


    private runSimulation(): void {
        if (this.intervalBreathCurves) clearInterval(this.intervalBreathCurves)
        if (this.intervalHeartCurves) clearInterval(this.intervalHeartCurves)
        if (this.soundInterval) clearInterval(this.soundInterval)
        if (this.monitorState.simulationStatus === SimulationStatusEnum.RUNNING) {
            this.soundAlarm();
            this.simulationBreathCurves();
            this.simulationHeartCurves();
            if (this.monitorState?.soundStatus?.heartFreqSound) {
                this.soundInterval = setInterval(() => {
                    this.audioPlayerService.playSound();
                }, (60 / this.getHeartRate()) * 1000)
            }
        }
    }

    private updateCurvesDataset(): void {
        this.chartComponents.forEach((chartComponent: ChartComponent, index: number) => {
            const curveConfiguration: PhysiologicalParamaterI = this.monitorState.parametersWithCurves[index];
            chartComponent.updateDataset(curveConfiguration.normalizedCurve);
        })
    }

    private simulationBreathCurves(): void {
        this.intervalBreathCurves = setInterval(() => {
            this.updateBreathRateCurves();
        }, CurvesService.getBreathSamplingRate(this.monitorState.parameterInformation.breathRate))
    }

    private updateBreathRateCurves(): void {
        this.chartComponents.forEach((chartComponent: ChartComponent, index: number) => {
            const curveConfiguration: PhysiologicalParamaterI = this.monitorState.parametersWithCurves[index];
            if (curveConfiguration.source === PhysiologicalParameterSourceEnum.Breath) {
                chartComponent.updateRealTimeDataset();
            }
        })
    }

    private updateHeartRateCurves(): void {
        this.chartComponents.forEach((chartComponent: ChartComponent, index: number) => {
            if (!index) this.soundHeartRate(chartComponent.getCurrentIndex());
            const curveConfiguration: PhysiologicalParamaterI = this.monitorState.parametersWithCurves[index];
            if (curveConfiguration.source === PhysiologicalParameterSourceEnum.Heart) {
                chartComponent.updateRealTimeDataset();
            }
        })
    }

    private simulationHeartCurves(): void {
        this.intervalHeartCurves = setInterval(() => {
            this.updateHeartRateCurves();
        }, this.curvesHelper.getDrawFrequency(this.getHeartRate()))
    }




    public getAnimalName(): string {
        return this.monitorState.scenario.animalName;
    }

    public getCurvesToShowInMonitor(): PhysiologicalParamaterI[] {
        return this.monitorState.parametersWithCurves
            .filter((curveData: PhysiologicalParamaterI) => curveData.showCurves)
    }

    public getChartHeight(): string {
        if (window.innerHeight > 900) {
            return '200px';
        }
        return '135px';
    }

    // Define la función trackByFn para realizar un seguimiento de los elementos por su ID
    public trackByFn(index: number, item: PhysiologicalParamaterI): number {
        return item.id_pp;
    }

    public getScenarioDescription(): string {
        return this.monitorState.scenario.description;
    }

    public isPausedSimulation(): boolean {
        return this.monitorState.simulationStatus === SimulationStatusEnum.PAUSED
    }

    public isMonitorConnected(): boolean {
        return this.monitorState && this.monitorState.simulationStatus !== SimulationStatusEnum.OFF
            && this.monitorState.simulationStatus !== SimulationStatusEnum.STOPPED
    }

    public startMeasureNIBP(): boolean {
        return this.monitorState?.nibpMeasurement.startInmediatly
    }

    public getTimePeriodNIBP(): number {
        return this.monitorState?.nibpMeasurement?.time;
    }

    public getPlayRate(): number {
        return (this.getHeartRate() / 60);
    }

    public isStoppedSimulation(): boolean {
        return this.monitorState && this.monitorState.simulationStatus === SimulationStatusEnum.STOPPED;
    }

    public getBreathRate(): number {
        return this.monitorState.parameterInformation.breathRate;
    }

    public getHeartRate(): number {
        return this.monitorState.parameterInformation.heartRate;
    }

    public getTemperature(): number {
        return this.monitorState.parameterInformation.temperature;
    }

    public getInspirationCO2(): number {
        return this.monitorState.parameterInformation.inspirationCO2;
    }

    public getEndTidalCO2(): number {
        return this.monitorState.parameterInformation.endTidalCO2;
    }

    public getDiastolicPressure(): number {
        return this.monitorState.parameterInformation.ibpDiastolic;
    }

    public getSystolicPressure(): number {
        return this.monitorState.parameterInformation.ibpSystolic;
    }

    public getMeanPressure(): number {
        return this.monitorState.parameterInformation.ibpMean;
    }


    public showAlarms(index: number): boolean {
        const parameter: PhysiologicalParamaterI = this.monitorState.parametersWithCurves[index];
        if (ParameterHelper.isECGParameter(parameter)) {
            if (this.monitorState.parameterInformation.heartRate <= parameter.alert_low ||
                this.monitorState.parameterInformation.heartRate >= parameter.alert_high) {
                if (this.monitorState?.soundStatus?.alarms)
                    this.alarmPlayerService.playSound(false);
                return true;
            }
        }
        if (ParameterHelper.isIBPParameter(parameter)) {
            if (this.monitorState.parameterInformation.ibpDiastolic <= parameter.alert_low ||
                this.monitorState.parameterInformation.ibpDiastolic >= parameter.alert_high_2 ||
                this.monitorState.parameterInformation.ibpSystolic <= parameter.alert_low_2 ||
                this.monitorState.parameterInformation.ibpSystolic >= parameter.alert_high) {
                if (this.monitorState?.soundStatus?.alarms)
                    this.alarmPlayerService.playSound(false);
                return true;
            }
        }

        if (ParameterHelper.isCapnoParameter(parameter)) {
             if (this.monitorState.parameterInformation.inspirationCO2 <= parameter.alert_low ||
                this.monitorState.parameterInformation.inspirationCO2 >= parameter.alert_high_2 ||
                this.monitorState.parameterInformation.endTidalCO2 <= parameter.alert_low_2 ||
                this.monitorState.parameterInformation.endTidalCO2 >= parameter.alert_high) {
                if (this.monitorState?.soundStatus?.alarms)
                    this.alarmPlayerService.playSound(false);
                return true;
            }
        }

        if (ParameterHelper.isPletismographyParameter(parameter)) {
            if (this.monitorState.parameterInformation.spO2 <= parameter.alert_low ||
                this.monitorState.parameterInformation.spO2 >= parameter.alert_high) {
               if (this.monitorState?.soundStatus?.alarms)
                    this.alarmPlayerService.playSound(false);
               return true;
            }
        }
        return false;
    }

    public getOxygenSaturation(): number {
        return this.monitorState.parameterInformation.spO2;
    }


    private soundAlarm(): void {
            this.alarmPlayerService.stopSound();
    }

    private soundHeartRate(currentIndex: number): void {
        const ecgParameter: PhysiologicalParamaterI = this.monitorState.parametersWithCurves[0];
        if (!ecgParameter.disconnected) {
            this.heartAttackAudioService.stopSound();
            const currentValueNormalized: number = this.monitorState.parametersWithCurves[0].normalizedCurve[currentIndex][1];
            const firstValue: number = this.monitorState.parametersWithCurves[0].curve[0][1];
            if (currentValueNormalized && currentValueNormalized === firstValue) {
                    // this.audioPlayerService.playSound();
            }
        } else if (this.monitorState?.soundStatus?.heartFreqSound)
                this.heartAttackAudioService.playSound(false);
    }

}
