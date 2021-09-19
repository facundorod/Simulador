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
    private clockTimer: number;
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
    private firstSimulation: boolean;
    public tooltipPause: ApexTooltip = {
        enabled: true,
    }

    constructor(private monitorService: MonitorService) {
        super();
    }


    ngOnInit(): void {
        this.checkLocalStorage();
        this.clockTimer = 0.0;
        this.firstSimulation = true;
        this.curveTimers = [];
        this.maxValues = [];
        this.chartsOptions = [];
    }

    ngOnDestroy() {
        clearInterval(this.simulationTimer);
        this.charts.forEach((chart: ChartComponent) => {
            chart.destroy();
        })
    }



    private initCurveTimers(): void {
        this.currentState.curves.forEach((curve: CurvesI) => {
            if (curve.curveValues.length > 0) {
                this.curveTimers.push(0);
                const maxValue: number = curve.curveValues[curve.curveValues.length - 1][0];
                this.maxValues.push(maxValue);
            }
        });
    }

    private checkLocalStorage(): void {
        // Create the conection with the monitor service
        this.monitorService.getInfo().subscribe(
            (simulationState: StatesI) => {
                if (simulationState) {
                    this.updateCurves(simulationState);
                    this.parameterInfo = JSON.parse(localStorage.getItem('parameterState'));
                } else {
                    this.currentState = null;
                    this.lastState = null;
                    this.animalSpecie = null;
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



    private updateCurves(simulationState: StatesI): void {
        this.currentState = simulationState;
        this.animalSpecie = simulationState.animalSpecie;
        if (this.chartsOptions.length == 0) {
            this.initCurveTimers();
            this.createDynamicChart();
        }
        clearInterval(this.simulationTimer);
        if (simulationState.action != 'pause') this.simulateCurves();
        this.showToolbar();

    }


    /**
     * Create dynamic chart (for simulation)
     */
    private createDynamicChart(): void {
        this.currentState.curves.forEach((curve: CurvesI) => {
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
                chart.setChart([]);
                this.chartsOptions.push(chart.getChart());
            }
        });
    }

    /**
     * Simulate all curves
     */
    private simulateCurves() {
        if (this.currentState) {
            this.simulationTimer = setInterval(() => {
                if (this.currentState && this.currentState.curves) {
                    this.updateClockTimer();
                    this.currentState.curves.forEach((curve: CurvesI, index: number) => {
                        if (curve.curveValues.length > 0) {
                            this.simulateCurve(curve, index);
                            this.curveTimers[index] += (this.monitorConfiguration.getMonitorConfiguration().freqSample / 1000);
                        }
                    });
                    this.clockTimer = this.roundTimer(this.clockTimer + this.curvesHelper.calculateRate(this.parameterInfo.heartRate, this.monitorConfiguration.getMonitorConfiguration().freqSample));
                }
            }, this.monitorConfiguration.getMonitorConfiguration().clockTimer);
        }
    }

    private simulateCurve(curve: CurvesI, index: number): void {
        if (this.firstSimulation) {
            this.updateCurveTimer(index);
            this.updateDataset(index, curve.curveValues);
        } else {
            const currentDataset: any = this.chartsOptions[index].series.slice();
            this.updateCurveTimer(index);
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
        if (this.currentState.action == 'stop') {
            const chart: any = this.charts.toArray()[index];
            const maxY: number = chart.yaxis.max;
            const minY: number = chart.yaxis.min;
            if (maxY && minY)
                currentDataset[0].data.push([this.clockTimer, (maxY + minY) / 2]);

        } else {
            let closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(curveValues, curveTimer);
            const interpolationNumber: number = this.curvesHelper.linealInterpolation(closestIndex.lessValue[0],
                closestIndex.greaterValue[0], curveTimer, closestIndex.lessValue[1], closestIndex.lessValue[1]);
            currentDataset[0].data.push([this.clockTimer, interpolationNumber]);
        }

        this.updateChart(currentDataset, index, false);
    }

    /**
     * Update all values on currentDataset for the simulation
     * @param currentDataset
     * @param index
     */
    private updateDatasetSimulation(currentDataset: any, index: number): void {
        let curveValues = currentDataset[0].data;
        let curveValuesSimulation = currentDataset[1].data;
        if (this.currentState.action == 'stop') {
            const chart: any = this.charts.toArray()[index];
            const maxY: number = chart.yaxis.max;
            const minY: number = chart.yaxis.min;
            if (maxY && minY)

                curveValuesSimulation.push([this.clockTimer, (maxY + minY) / 2]);
        } else {
            const originalDataset: [number, number][] = this.currentState.curves[index].curveValues;
            let closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(originalDataset, this.curveTimers[index]);
            const interpolationNumber: number = this.curvesHelper.linealInterpolation(closestIndex.lessValue[0],
                closestIndex.greaterValue[0], this.curveTimers[index], closestIndex.lessValue[1], closestIndex.lessValue[1]);
            // Synchronize between past and actual dataset
            curveValuesSimulation.push([this.clockTimer, interpolationNumber]);
        }
        this.deleteOldPoints(curveValues);
        this.updateChart(currentDataset, index, true);


    }


    /**
    * Update clock timer and update if the first simulation is completed:
    * If clockTimer overcome monitor's max samples, then clockTimer = 0.0
    */
    private updateClockTimer(): void {
        if (this.firstSimulation) {
            if (this.clockTimer >= this.monitorConfiguration.getMonitorConfiguration().maxSamples) {
                this.clockTimer = 0.0;
                this.firstSimulation = false;
                // At this point, the first simulation end, so we create a new dataset for all curves where
                // we're going to push the simulation data.
                this.createSimulationDataset();
            }
        } else {
            if (this.clockTimer >= this.monitorConfiguration.getMonitorConfiguration().maxSamples) {
                this.clockTimer = 0.0;
                // At this point, the clock timer overcomes monitor max samples, so we need to
                // "restart" simulation
                this.swapCurves();
            }
        }
    }

    /**
     * Update all Apex Charts
     */
    private updateChart(chartDataset: ApexAxisChartSeries, index: number, animate: boolean = true): void {

        const chart: ChartComponent = this.charts.toArray()[index];
        if (chart) {
            chart.updateSeries(chartDataset, false);
        }
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
    private deleteOldPoints(oldDataset: [number, number][]): void {
        let i: number = 0;
        while (i < oldDataset.length && oldDataset[i][0] <= this.clockTimer) {
            oldDataset.splice(i, 1);
        }
    }

    /**
     * Swap curves between simulation data and current dataset. Old dataset will be the previous
     * simulation dataset, and new dataset will start empty
     */
    private swapCurves(): void {
        for (let index = 0; index < this.currentState.curves.length; index++) {
            if (this.currentState.curves[index].curveValues.length > 0) {
                const currentDataset: any = this.chartsOptions[index].series;
                const auxDataset: [number, number][] = currentDataset[1].data;
                currentDataset[0].data = auxDataset;
                currentDataset[1].data = [];
                this.updateChart(currentDataset, index, false);
            }
        }
    }


    /**
   * Create simulation dataset for all curves
   */
    private createSimulationDataset(): void {

        for (let index = 0; index < this.currentState.curves.length; index++) {
            const currentDataset: any = this.chartsOptions[index]?.series;
            if (currentDataset)
                currentDataset.push({
                    data: [],
                    color: currentDataset[0].color,
                });
        }
    }

    private showToolbar(): void {
        const charts: ChartComponent[] = this.charts.toArray();
        for (let i: number = 0; i < charts.length; i++) {
            this.currentState.action == 'pause' ? charts[i].chart.toolbar = {
                show: true
            } : charts[i].chart.toolbar = {
                show: false
            }
            this.currentState.action == 'pause' ? charts[i].chart.zoom = {
                enabled: true
            } : charts[i].chart.zoom = {
                enabled: false
            };

            this.currentState.action == 'pause' ? charts[i].tooltip = {
                enabled: true
            } : charts[i].tooltip = {
                enabled: false
            };
            charts[i].updateOptions(charts[i]);
        }

    }
}


