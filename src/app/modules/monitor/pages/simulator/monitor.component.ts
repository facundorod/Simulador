import { AfterViewInit, Component, HostListener, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, TrackByFunction, ViewChildren } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base.component";
import { AnimalSpeciesI } from "@app/shared/models/animal-speciesI";
import { MonitorService } from "../../services/monitor.service";
import { CurvesI } from "@app/shared/models/curvesI";
import { StatesI } from "@app/shared/models/stateI";
import { Monitor } from "@app/shared/models/monitor";
import { ApexAxisChartSeries, ApexTooltip, ChartComponent } from "ng-apexcharts";
import { ParameterInfoI } from "@app/shared/models/parameterInfoI";
import { ChartConfigurer, ChartOptions } from "@app/modules/simulation/helpers/chartConfigurer";
import { ClosestPoint, CurvesHelper } from "@app/modules/simulation/helpers/curvesHelper";
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
    public animalSpecie: AnimalSpeciesI;
    @ViewChildren('chart') charts: QueryList<ChartComponent>;
    private curveTimers: number[] = [];
    public today: Date = new Date();
    public lastState: StatesI;
    public maxSamples: number = 4;
    private heartTimer: number;
    private auxHeartTimer: number;
    private auxBreathTimer: number;
    private breathTimer: number;
    private firstSimulationBreath: boolean;
    private parameterInfo: ParameterInfoI;
    // Max values for each curve. This value contains the last element (in seconds) for
    // the curve on the interval [0-100%]
    private maxValues: number[];
    public chartsOptions: Partial<ChartOptions>[];
    private curvesHelper: CurvesHelper = new CurvesHelper();
    public stopCurves: StatesI | any = {};
    private simulationTimer: NodeJS.Timeout;
    public monitorConfiguration: Monitor = new Monitor();
    public trackByFn: TrackByFunction<CurvesI> = (_, curve: CurvesI) => curve.curveConfiguration.id_pp;
    private firstSimulationHeart: boolean;
    public tooltipPause: ApexTooltip = {
        enabled: true,
    }

    constructor(private monitorService: MonitorService) {
        super();
        this.initVariables()
    }


    ngOnInit(): void {
        this.checkLocalStorage();

    }

    ngOnDestroy() {
        clearInterval(this.simulationTimer);
        this.charts.forEach((chart: ChartComponent) => {
            chart.destroy();
        })
    }



    private initCurveTimers(curve: CurvesI): void {
        if (curve?.curveValues.length > 0) {
            this.curveTimers.push(0);
            const maxValue: number = curve.curveValues[curve.curveValues.length - 1][0];
            this.maxValues.push(maxValue);
        }
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
                    this.updateCurves(simulationState);
                    this.parameterInfo = JSON.parse(localStorage.getItem('parameterState'));
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


    /**
     * Initialize all variables
     */
    private initVariables() {
        this.currentState = null;
        this.lastState = null;
        this.animalSpecie = null;
        this.firstSimulationHeart = true;
        this.firstSimulationBreath = true;
        this.curveTimers = [];
        this.maxValues = [];
        this.chartsOptions = [];
        this.breathTimer = 0.0;
        this.auxBreathTimer = 0.0;
        this.heartTimer = 0.0;
        this.auxHeartTimer = 0.0;
        clearInterval(this.simulationTimer);
    }


    private updateCurves(simulationState: StatesI): void {
        this.currentState = simulationState;
        this.animalSpecie = simulationState.animalSpecie;
        this.initCharts();
        // If there were changes in the state then clear the previous timer
        clearInterval(this.simulationTimer);
        if (simulationState.action != 'pause') this.simulateCurves();
        // Show / Hide toolbar for all curves
        this.showToolbar();

    }

    private initCharts(): void {
        if (this.chartsOptions?.length == 0) {
            this.currentState.curves.forEach((curve: CurvesI) => {
                this.initCurveTimers(curve);
                this.createDynamicChart(curve);
            })
        }
    }


    /**
     * Create dynamic chart (for simulation)
     */
    private createDynamicChart(curve: CurvesI): void {
        if (curve.curveValues.length > 0) {
            const maxY: number = this.curvesHelper.getMaxY(curve.curveValues) + 1;
            const minY: number = this.curvesHelper.getMinY(curve.curveValues) - 1;
            const chart: ChartConfigurer = new ChartConfigurer({
                colorLine: curve.curveConfiguration.colorLine,
                height: 100,
                minX: 0,
                maxX: this.monitorConfiguration.getMonitorConfiguration().maxSamples,
                minY: minY,
                maxY: maxY,
                toolbar: false
            });
            chart.setChart([], null);
            this.chartsOptions.push(chart.getChart());
        }
    }

    /**
     * Simulate all curves
     */
    private simulateCurves() {
        if (this.currentState) {
            this.simulationTimer = setInterval(() => {
                this.updateHeartTimer();
                this.updateBreathTimer();
                this.currentState.curves.forEach((curve: CurvesI, index: number) => {
                    if (curve.curveValues.length > 0) {
                        this.simulateCurve(curve, index);
                        this.updateCurveTimers(index, curve);
                    }
                });
                this.heartTimer += (this.monitorConfiguration.getMonitorConfiguration().freqSampleHeart / 1000);
                this.breathTimer += (this.monitorConfiguration.getMonitorConfiguration().freqSampleBreath / 1000);
                this.today = new Date();
            }, this.monitorConfiguration.getMonitorConfiguration().clockTimer);
        }
    }

    private updateCurveTimers(index: number, curve: CurvesI) {
        if (curve.curveConfiguration.source.label.toUpperCase() == 'CAR' ||
            curve.curveConfiguration.source.label.toUpperCase() == 'SPO2') {
            this.curveTimers[index] = this.roundTimer(this.curveTimers[index] + this.curvesHelper.calculateRate(this.parameterInfo.heartRate, this.monitorConfiguration.getMonitorConfiguration().freqSampleHeart));
        }
        if (curve.curveConfiguration.source.label.toUpperCase() == 'RESP')
            this.curveTimers[index] = this.roundTimer(this.curveTimers[index] + this.curvesHelper.calculateRate(this.parameterInfo.breathRate, this.monitorConfiguration.getMonitorConfiguration().freqSampleBreath));
    }

    private simulateCurve(curve: CurvesI, index: number): void {
        this.updateCurveTimer(index);
        if ((this.firstSimulationHeart && !this.isBreathCurve(index))
            || (this.firstSimulationBreath && this.isBreathCurve(index))) {
            this.updateDataset(index, curve.curveValues);
        } else {
            const currentDataset: any = this.chartsOptions[index].series.slice();
            this.updateDatasetSimulation(currentDataset, index);
        }
    }

    /**
        * Round timer
        * @param timer
        * @returns
        */
    private roundTimer(timer: number): number {
        return Math.round(timer * 100) / 100;
    }



    /**
     * Update curve timer. If the curve timer overcome the last item in the dataset, then
     * curve timer go back to 0.
     * @param curveValues
     */
    private updateCurveTimer(index: number): void {
        const curveTimer: number = this.curveTimers[index];
        const lastItem: number = this.maxValues[index];
        if (lastItem && curveTimer > lastItem) {
            this.curveTimers[index] = 0.0;
        }
    }

    /**
    * Update the dataset for the first simulation (until clock timer overcomes max samples value)
    * @param index
    * @param curveValues
    */
    private updateDataset(index: number, curveValues: [number, number][]): void {
        const currentDataset: any = this.chartsOptions[index].series.slice();
        const curveTimer: number = this.curveTimers[index];
        let isBreathCurve: boolean = this.isBreathCurve(index);
        if (this.currentState.action == 'stop') {
            const chart: any = this.charts.toArray()[index];
            const maxY: number = chart.yaxis.max;
            const minY: number = chart.yaxis.min;
            if (minY) currentDataset[0].data.push([isBreathCurve ? this.breathTimer : this.heartTimer, minY]);
        } else {
            let closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(curveValues, curveTimer);
            const interpolationNumber: number = this.curvesHelper.linealInterpolation(closestIndex.lessValue[0],
                closestIndex.greaterValue[0], curveTimer, closestIndex.lessValue[1], closestIndex.lessValue[1]);
            currentDataset[0].data.push([isBreathCurve ? this.breathTimer : this.heartTimer, interpolationNumber]);
        }
        this.updateChart(currentDataset, index, true);
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
        if (this.currentState.action == 'stop') {
            const chart: any = this.charts.toArray()[index];
            // const maxY: number = chart.yaxis.max;
            const minY: number = chart.yaxis.min;
            if (minY) curveValuesSimulation.push([isBreathCurve ? this.breathTimer : this.heartTimer, minY]);
        } else {
            const originalDataset: [number, number][] = this.currentState.curves[index].curveValues;
            let closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(originalDataset, this.curveTimers[index]);
            const interpolationNumber: number = this.curvesHelper.linealInterpolation(closestIndex.lessValue[0],
                closestIndex.greaterValue[0], this.curveTimers[index], closestIndex.lessValue[1], closestIndex.lessValue[1]);
            curveValuesSimulation.push([isBreathCurve ? this.breathTimer : this.heartTimer, interpolationNumber]);
        }
        this.deleteOldPoints(curveValues, isBreathCurve ? this.breathTimer : this.heartTimer);
        this.updateChart(currentDataset, index, false);


    }


    private isBreathCurve(index: number): boolean {
        return ((this.currentState.curves[index].curveConfiguration.source.label.toUpperCase() == 'RESP'));
    }

    /**
    * Update clock timer and update if the first simulation is completed:
    * If clockTimer overcome monitor's max samples, then clockTimer = 0.0
    */
    private updateHeartTimer(): void {
        if (this.firstSimulationHeart) {
            if (this.heartTimer >= this.monitorConfiguration.getMonitorConfiguration().maxSamples) {
                this.heartTimer = 0.0;
                this.firstSimulationHeart = false;
                // At this point, the first simulation end, so we create a new dataset for all curves where
                // we're going to push the simulation data.
                this.createSimulationDataset();
            }

        } else {
            if (this.heartTimer >= this.monitorConfiguration.getMonitorConfiguration().maxSamples) {
                this.heartTimer = 0.0;
                // At this point, the clock timer overcomes monitor max samples, so we need to
                // "restart" simulation
                this.swapCurves();
            }

        }
    }

    private updateBreathTimer(): void {
        if (this.firstSimulationBreath) {
            if (this.breathTimer >= this.monitorConfiguration.getMonitorConfiguration().maxSamples) {
                this.breathTimer = 0.0;
                this.firstSimulationBreath = false;
                // At this point, the first simulation end, so we create a new dataset for all curves where
                // we're going to push the simulation data.
                this.createSimulationDataset(true);
            }
        } else {
            if (this.breathTimer >= this.monitorConfiguration.getMonitorConfiguration().maxSamples) {
                this.breathTimer = 0.0;
                this.swapCurves(true);
            }
        }
    }

    /**
     * Update all Apex Charts
     */
    private updateChart(chartDataset: ApexAxisChartSeries, index: number, animate: boolean = true): void {

        const chart: ChartComponent = this.charts.toArray()[index];
        if (chart) chart.updateSeries(chartDataset, animate);
    }


    /**
     * Return the curve color
     * @param curve
     * @returns
     */
    public getColor(curve: CurvesI): string {
        return curve.curveConfiguration.colorLine;
    }

    public getSourceRateValue(curve: CurvesI): number {

        switch (curve.curveConfiguration.source.label.toUpperCase()) {
            case 'CAR':
                return this.parameterInfo.heartRate;
            case 'RESP':
                return this.parameterInfo.breathRate;
            case 'SPO2':
                return this.parameterInfo.spO2;
            default:
                break;
        }
    }

    /**
     * Delete all points less than actual curveTimer
     * @param oldDataset
     * @param valueToCompare
     */
    private deleteOldPoints(oldDataset: [number, number][], timerToCompare: number): void {
        let i: number = 0;
        while (i < oldDataset.length && oldDataset[i][0] <= timerToCompare) {
            oldDataset.splice(i, 1);
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
                    const currentDataset: any = this.chartsOptions[index].series;
                    const auxDataset: [number, number][] = currentDataset[1].data;
                    currentDataset[0].data = auxDataset;
                    currentDataset[1].data = [];
                    this.updateChart(currentDataset, index, true);
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
        return ((breathRate && this.currentState.curves[index].curveConfiguration.source.label.toUpperCase() == 'RESP') ||
            (!breathRate && this.currentState.curves[index].curveConfiguration.source.label.toUpperCase() != 'RESP'))
    }

    /**
     * Show or hidden the toolbar according to current action
     */
    private showToolbar(): void {
        const charts: ChartComponent[] = this.charts.toArray();
        for (let i: number = 0; i < charts.length; i++) {
            const currentOptions: any = charts[i];
            const curveConfiguration: CurvesConfigurationI = this.currentState.curves[i].curveConfiguration;
            const options: Partial<ChartOptions> = commonOptions(this.currentState.action == 'pause',
                currentOptions.xaxis.max, currentOptions.xaxis.min, currentOptions.yaxis.max, currentOptions.yaxis.min,
                (this.currentState.action == 'play' || this.currentState.action == 'pause') && curveConfiguration.label == 'etCO2' ? 'area' : currentOptions.chart.type);
            charts[i].updateOptions(options);
        }

    }
}


