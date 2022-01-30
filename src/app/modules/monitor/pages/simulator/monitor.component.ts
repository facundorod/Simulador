import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    QueryList,
    TrackByFunction,
    ViewChildren,
} from "@angular/core";
import { BaseComponent } from "@app/shared/components/base.component";
import { AnimalSpeciesI } from "@app/shared/models/animal-speciesI";
import { MonitorService } from "../../services/monitor.service";
import { CurvesI } from "@app/shared/models/curvesI";
import { StatesI } from "@app/shared/models/stateI";
import { Monitor } from "@app/shared/models/monitor";
import {
    ApexAxisChartSeries,
    ApexTooltip,
    ChartComponent,
    ChartType,
} from "ng-apexcharts";
import { ParameterInfoI } from "@app/shared/models/parameterInfoI";
import {
    ChartConfigurer,
    ChartOptions,
} from "@app/modules/simulation/helpers/chartConfigurer";
import {
    ClosestPoint,
    CurvesHelper,
} from "@app/modules/simulation/helpers/curvesHelper";
import { commonOptions } from "@app/modules/simulation/helpers/chartConfigurer";
import { CurvesConfigurationI } from "@app/shared/models/curvesConfigurationI";
@Component({
    selector: "app-monitor",
    templateUrl: "./monitor.component.html",
    styleUrls: ["./monitor.component.css"],
})
export class MonitorComponent
    extends BaseComponent
    implements OnInit, OnDestroy {
    public currentState: StatesI;
    // New state after the current beat
    public newCurrentState: StatesI;
    public animalSpecie: AnimalSpeciesI;
    @ViewChildren("chart") charts: QueryList<ChartComponent>;
    public today: Date = new Date();
    private heartTimer: number;
    private maxSize: number = 51;
    private breathTimer: number;
    private firstSimulationBreath: boolean;
    private currentIndex: number = 0;
    private parameterInfo: ParameterInfoI;
    public curvesAndParams: any[] = [];
    private changeCurves: boolean = false;
    public chartsOptions: Partial<ChartOptions>[];
    private curvesHelper: CurvesHelper = new CurvesHelper();
    private simulationTimer: NodeJS.Timeout;
    private enableAlerts: boolean[] = [];
    public monitorConfiguration: Monitor = new Monitor();
    public trackByFn: TrackByFunction<CurvesI> = (_, curve: CurvesI) =>
        curve.curveConfiguration.id_pp;
    private firstSimulationHeart: boolean;
    public enableSoundAlarm: boolean = false;
    public tooltipPause: ApexTooltip = {
        enabled: true,
    };
    constructor(private monitorService: MonitorService) {
        super();
        this.initVariables();
    }

    ngOnInit(): void {
        this.checkLocalStorage();
    }

    ngOnDestroy() {
        clearInterval(this.simulationTimer);
    }



    public openFullscreen(): void {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    }

    /* Close fullscreen */
    public closeFullscreen(): void {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    public isFullScren(): boolean {
        return document.fullscreenElement != null;
    }

    /**
     * Connect with the monitor service, if new state is loaded then update curves,
     * else it go back to the initial scenario
     */
    private checkLocalStorage(): void {
        // Create the conection with the monitor service
        this.monitorService.getInfo().subscribe(
            (simulationState: StatesI) => {
                if (simulationState) {
                    this.updateParameterInfo();
                    if (this.currentIndex == 0)
                        this.changeCurves = true;
                    else this.changeCurves = false;
                    this.updateCurves(simulationState);
                } else {
                    this.initVariables();
                }
            },
            (error: Error) => {
                console.log(error);
            },
            () => {
                console.log("Simulation finished!");
            }
        );
    }

    private updateParameterInfo(): void {
        this.parameterInfo = JSON.parse(localStorage.getItem("parameterState"));
    }

    /**
     * Initialize all variables
     */
    private initVariables() {
        this.currentState = null;
        this.newCurrentState = null;
        this.animalSpecie = null;
        this.enableAlerts = [];
        this.firstSimulationHeart = true;
        this.firstSimulationBreath = true;
        this.curvesAndParams = [];
        this.chartsOptions = [];
        this.currentIndex = 0;
        this.maxSize = 51;
        this.breathTimer = 0.0;
        this.heartTimer = 0.0;
        clearInterval(this.simulationTimer);
    }

    private updateCurves(simulationState: StatesI): void {
        if (this.changeCurves)
            this.currentState = simulationState;
        this.newCurrentState = JSON.parse(JSON.stringify(simulationState));
        this.animalSpecie = simulationState.animalSpecie;
        this.initCharts();
        // If there were changes in the state then clear the previous timer
        clearInterval(this.simulationTimer);
        if (simulationState.action != "pause") this.simulateCurves();
        // Show / Hide toolbar for all curves
        this.showToolbar();
    }

    private initCharts(): void {
        let initCharts: boolean = this.chartsOptions?.length == 0;
        this.currentState.curves.forEach((curve: CurvesI, index: number) => {
            const enableAlert: boolean | undefined = this.enableAlerts[index];
            if (initCharts) this.createDynamicChart(curve);
            if (enableAlert == undefined) {
                const alert: boolean = this.enableAlert(
                    curve.curveConfiguration
                ) && this.currentState.action !== 'stop';
                this.enableAlerts.push(alert);
            } else
                this.enableAlerts[index] = this.enableAlert(
                    curve.curveConfiguration
                ) && this.currentState.action !== 'stop';
            this.enableSoundAlarm =
                this.enableAlerts.includes(true) &&
                !this.currentState.muteAlarms && this.currentState.action !== 'stop';
            this.updateMaxAndMin(index);

        });
    }


    private updateMaxAndMin(index: number): void {
        const currentChart: ChartComponent | any = this.charts.toArray()[index];
        const curve: CurvesI = this.newCurrentState.curves[index];
        if (currentChart) {
            // this.currentIndex = 0;
            const maxY: number =
                this.curvesHelper.getMaxY(curve.curveValues);
            currentChart.yaxis.max = curve.curveConfiguration.label.toUpperCase() == "CO2" ||
                curve.curveConfiguration.label.toUpperCase() == "ETCO2"
                ? maxY * 2
                : maxY;

            this.charts.toArray()[index] = currentChart;
        }

    }

    /**
     * Create dynamic chart (for simulation)
     */
    private createDynamicChart(curve: CurvesI): void {
        if (curve.curveValues.length > 0) {
            const maxY: number =
                this.curvesHelper.getMaxY(curve.curveValues);
            const minY: number = 0;
            const chart: ChartConfigurer = new ChartConfigurer({
                colorLine: curve.curveConfiguration.colorLine,
                height: 143,
                minX: 0,
                maxX: this.monitorConfiguration.getMonitorConfiguration()
                    .maxSamples,
                minY,
                maxY:
                    curve.curveConfiguration.label.toUpperCase() == "CO2" ||
                        curve.curveConfiguration.label.toUpperCase() == "ETCO2"
                        ? maxY * 2
                        : maxY,
                toolbar: false,
            });
            let type: ChartType = null;
            if (
                (curve.curveConfiguration.label.toUpperCase() == "ETCO2" ||
                    curve.curveConfiguration.label.toUpperCase() == "CO2") &&
                this.currentState.action !== "stop"
            )
                type = "area";

            chart.setChart([], type);
            this.chartsOptions.push(chart.getChart());
            this.curvesAndParams.push({
                chart: chart.getChart(),
                curveConfiguration: curve.curveConfiguration,
            });
        } else {
            this.curvesAndParams.push({
                curveConfiguration: curve.curveConfiguration,
            });
        }
    }

    /**
     * Simulate all curves
     */
    private simulateCurves() {
        if (this.currentState) {
            this.simulationTimer = setInterval(() => {
                // if the currentIndex is the last element, then the currentIndex = 0.
                this.updateHeartTimer();
                this.updateBreathTimer();
                this.updateCurrentIndex();

                this.currentState.curves.forEach(
                    (curve: CurvesI, index: number) => {
                        if (curve.curveValues.length > 0) {
                            this.simulateCurve(curve, index);
                        }
                    }
                );
                this.updateCharts();
                this.heartTimer +=
                    (this.monitorConfiguration.getMonitorConfiguration()
                        .freqHeart / 1000);
                this.breathTimer += (this.monitorConfiguration.getMonitorConfiguration()
                    .freqBreath / 1000);
                this.currentIndex += 1;
                this.today = new Date();
            }, this.monitorConfiguration.getMonitorConfiguration().clockTimer);
        }
    }



    private simulateCurve(curve: CurvesI, index: number): void {
        if (
            ((this.firstSimulationHeart && !this.isBreathCurve(index)) ||
                (this.firstSimulationBreath && this.isBreathCurve(index))) &&
            curve.curveValues.length > 0
        ) {
            this.updateDataset(index, curve.curveValues);
        } else {
            if (
                curve.curveValues.length > 0 &&
                this.curvesAndParams[index]?.chart?.series
            ) {
                const currentDataset: any =
                    this.curvesAndParams[index]?.chart?.series.slice();
                this.updateDatasetSimulation(currentDataset, index);
            }
        }
    }


    /**
     * Update currentIndex. If the currentIndex overcome the last item in the dataset, then
     * currentIndex go back to 0.
     * @param curveValues
     */
    private updateCurrentIndex(): void {
        if (this.currentIndex >= this.maxSize) {
            this.currentIndex = 0;
            if (this.newCurrentState) {
                this.currentState = JSON.parse(JSON.stringify(this.newCurrentState));
            }
        }
    }


    public getAlerts(): boolean[] {
        return this.enableAlerts;
    }

    /**
     * Update the dataset for the first simulation (until clock timer overcomes max samples value)
     * @param index
     * @param curveValues
     */
    private updateDataset(
        index: number,
        curveValues: [number, number][]
    ): void {
        const currentDataset: any =
            this.curvesAndParams[index]?.chart?.series?.slice();
        if (currentDataset) {
            let isBreathCurve: boolean = this.isBreathCurve(index);
            if (this.currentState.action == "stop") {
                currentDataset[0].data.push([
                    isBreathCurve ? this.breathTimer : this.heartTimer,
                    0,
                ]);
            } else
                currentDataset[0].data.push([
                    isBreathCurve ? this.breathTimer : this.heartTimer,
                    curveValues[this.currentIndex][1],
                ]);

        }
    }

    /**
     * Update all values on currentDataset for the simulation
     * @param currentDataset
     * @param index
     */
    private updateDatasetSimulation(currentDataset: any, index: number): void {
        let curveValues = currentDataset[0].data;
        let isBreathCurve: boolean = this.isBreathCurve(index);
        let curveValuesSimulation = currentDataset[1].data;
        if (this.currentState.action == "stop") {
            curveValuesSimulation.push([
                isBreathCurve ? this.breathTimer : this.heartTimer,
                0,
            ]);
        } else {
            const originalDataset: [number, number][] =
                this.currentState.curves[index].curveValues;

            curveValuesSimulation.push([
                isBreathCurve ? this.breathTimer : this.heartTimer,
                originalDataset[this.currentIndex][1],
            ]);
        }
        this.deleteOldPoints(
            curveValues,
            isBreathCurve ? this.breathTimer : this.heartTimer
        );
        currentDataset[0].data = curveValues;
        currentDataset[1].data = curveValuesSimulation;
    }

    private isBreathCurve(index: number): boolean {
        return (
            this.currentState.curves[
                index
            ].curveConfiguration?.source?.label?.toUpperCase() == "RESP"
        );
    }

    /**
     * Update clock timer and update if the first simulation is completed:
     * If clockTimer overcome monitor's max samples, then clockTimer = 0.0
     */
    private updateHeartTimer(): void {
        if (this.firstSimulationHeart) {
            if (
                this.heartTimer >=
                this.monitorConfiguration.getMonitorConfiguration().maxSamples
            ) {
                this.heartTimer = 0.0;
                this.firstSimulationHeart = false;
                // At this point, the first simulation end, so we create a new dataset for all curves where
                // we're going to push the simulation data.
                this.createSimulationDataset();
            }
        } else {
            if (
                this.heartTimer >=
                this.monitorConfiguration.getMonitorConfiguration().maxSamples
            ) {
                this.heartTimer = 0.0;
                // At this point, the clock timer overcomes monitor max samples, so we need to
                // "restart" simulation
                this.swapCurves();
            }
        }
    }

    private updateBreathTimer(): void {
        if (this.firstSimulationBreath) {
            if (
                this.breathTimer >=
                this.monitorConfiguration.getMonitorConfiguration().maxSamples
            ) {
                this.breathTimer = 0.0;
                this.firstSimulationBreath = false;
                // At this point, the first simulation end, so we create a new dataset for all curves where
                // we're going to push the simulation data.
                this.createSimulationDataset(true);
            }
        } else {
            if (
                this.breathTimer >=
                this.monitorConfiguration.getMonitorConfiguration().maxSamples
            ) {
                this.breathTimer = 0.0;
                this.swapCurves(true);
            }
        }
    }

    private updateCharts(): void {
        this.charts.toArray().forEach((chart: ChartComponent) => {
            chart.updateSeries(chart.series, false);
        });
    }

    /**
     * Update all Apex Charts
     */
    private updateChart(
        chartDataset: ApexAxisChartSeries,
        index: number,
    ): void {
        const chart: ChartComponent = this.charts.toArray()[index];
        if (chart) chart.updateSeries(chartDataset, false);
    }

    /**
     * Return the curve color
     * @param curve
     * @returns
     */
    public getColor(curve: CurvesI): string {
        if (curve?.curveConfiguration && curve.curveConfiguration?.colorLine)
            return curve.curveConfiguration.colorLine;
        return null;
    }

    public getSourceRateValue(curve: CurvesI): number {
        if (curve?.curveConfiguration && curve.curveConfiguration.source) {
            switch (curve.curveConfiguration.source.label.toUpperCase()) {
                case "CAR":
                    return this.parameterInfo.heartRate;
                case "RESP":
                    return this.parameterInfo.breathRate;
                case "SPO2":
                    return this.parameterInfo.spO2;
                default:
                    break;
            }
        } else {
            switch (curve.curveConfiguration.label.toUpperCase()) {
                case "TEMP":
                    return this.parameterInfo.temperature;
                default:
                    return curve.curveConfiguration.refValue;
            }
        }

        return -1;
    }

    public getParameterInfo(): ParameterInfoI {
        return this.parameterInfo;
    }

    public enableAlert(curve: CurvesConfigurationI): boolean {
        if (
            curve.source?.label.toUpperCase() === "CAR" &&
            (curve.alert_high <= this.parameterInfo.heartRate ||
                curve.alert_low >= this.parameterInfo.heartRate)
        )
            return true;
        if (
            curve.source?.label.toUpperCase() === "RESP" &&
            (curve.alert_high <= this.parameterInfo.breathRate ||
                curve.alert_low >= this.parameterInfo.breathRate)
        )
            return true;
        if (
            curve.source?.label.toUpperCase() === "SPO2" &&
            (curve.alert_high <= this.parameterInfo.spO2 ||
                curve.alert_low >= this.parameterInfo.spO2)
        )
            return true;
        return false;
    }

    /**
     * Delete all points less than actual curveTimer
     * @param oldDataset
     * @param valueToCompare
     */
    private deleteOldPoints(
        oldDataset: [number, number][],
        timerToCompare: number
    ): void {
        let i: number = 0;
        while (i < oldDataset.length && oldDataset[i][0] <= timerToCompare) {
            oldDataset.splice(i, 1);
            i++;
        }
    }

    /**
     * Swap curves between simulation data and current dataset. Old dataset will be the previous
     * simulation dataset, and new dataset will start empty
     */
    private swapCurves(breathCurve: boolean = false): void {
        for (let index = 0; index < this.currentState.curves.length; index++) {
            if (this.currentState.curves[index].curveValues.length > 0) {
                if (this.hasToChangeDataset(index, breathCurve)) {
                    const currentDataset: any =
                        this.chartsOptions[index].series;
                    const auxDataset: [number, number][] =
                        currentDataset[1].data;
                    currentDataset[0].data = auxDataset;
                    currentDataset[1].data = [];
                    this.updateChart(currentDataset, index);
                }
            }
        }
    }

    /**
     * Create simulation dataset for all curves
     */
    private createSimulationDataset(breathRate: boolean = false): void {
        for (let index = 0; index < this.currentState.curves.length; index++) {
            if (this.hasToChangeDataset(index, breathRate)) {
                const currentDataset: any = this.chartsOptions[index]?.series;
                if (currentDataset)
                    currentDataset.push({
                        data: [],
                        color: currentDataset[0].color,
                    });
            }
        }
    }

    /**
     * Check if the dataset should be changed according to source label
     * @param index
     * @param breathRate
     * @returns
     */
    private hasToChangeDataset(index: number, breathRate: boolean): boolean {
        return (
            (breathRate &&
                this.currentState.curves[
                    index
                ].curveConfiguration?.source?.label?.toUpperCase() == "RESP") ||
            (!breathRate &&
                this.currentState.curves[
                    index
                ].curveConfiguration?.source?.label?.toUpperCase() != "RESP")
        );
    }

    /**
     * Show or hidden the toolbar according to current action
     */
    private showToolbar(): void {
        const charts: ChartComponent[] = this.charts.toArray();
        for (let i: number = 0; i < charts.length; i++) {
            const currentOptions: any = charts[i];
            if (this.currentState.curves[i]?.curveConfiguration) {
                const curveConfiguration: CurvesConfigurationI =
                    this.currentState.curves[i].curveConfiguration;
                const options: Partial<ChartOptions> = commonOptions(
                    this.currentState.action == "pause",
                    currentOptions.xaxis.max,
                    currentOptions.xaxis.min,
                    currentOptions.yaxis.max,
                    currentOptions.yaxis.min,
                    this.currentState.action !== "stop" &&
                        (curveConfiguration.label.toUpperCase() == "ETCO2" ||
                            curveConfiguration.label.toUpperCase() == "CO2")
                        ? "area"
                        : currentOptions.chart.type
                );
                if (this.currentState.action !== "stop")
                    charts[i].updateOptions(options);
            }
        }
    }

    public calculatePlayRate(): number {
        return this.parameterInfo.heartRate / 1000;
    }

    public showMinAndMax(curve: CurvesI): boolean {
        return (
            curve.curveConfiguration.label.toUpperCase() === 'CO2' ||
            curve.curveConfiguration.label.toUpperCase() === 'IBP' ||
            curve.curveConfiguration.label.toUpperCase() === 'NIBP');
    }

    public getMinValue(index: number): number | null {
        const curves: CurvesI = this.currentState.curves[index];
        if (curves && curves.curveValues && curves.curveValues.length > 0)
            return Math.round(curves.curveValues[0][1]);
        return null;
    }

    public getMaxValue(index: number): number | null {
        const curves: CurvesI = this.currentState.curves[index];
        if (curves && curves.curveValues && curves.curveValues.length > 0)
            return Math.round(this.curvesHelper.getMaxY(curves.curveValues));
        return null;
    }

    public getMeanValue(index: number): number | null {
        const systolicIBP: number = this.getMaxValue(index);
        const diastolicIBP: number = this.getMinValue(index);
        if (systolicIBP) return Math.round(((2 * diastolicIBP) + systolicIBP) / 3);
        return null;
    }
}
