import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewChildren,
} from "@angular/core";
import { ApexAxisChartSeries, ChartComponent, ChartType } from "ng-apexcharts";
import {
    ChartConfigurer,
    ChartOptions,
} from "@app/modules/simulation/helpers/chartConfigurer";
import { CurvesI } from "@app/shared/models/curvesI";
import { Monitor } from "@app/shared/models/monitor";
import {
    ClosestPoint,
    CurvesHelper,
} from "@app/modules/simulation/helpers/curvesHelper";

@Component({
    selector: "app-mini-monitor",
    templateUrl: "./mini-monitor.component.html",
    styleUrls: ["./mini-monitor.component.css"],
})
export class MiniMonitorComponent implements OnInit, OnDestroy {
    @ViewChild("chart") chartComponent: ChartComponent;
    @Input() curves: CurvesI;
    @Input() breathCurve: boolean = false;
    @Input() rate: number;
    private simulationTimer: NodeJS.Timeout;
    private curveTimer: number;
    private maxValue: number;
    private timer: number = 0.0;
    private curvesHelper: CurvesHelper = new CurvesHelper();
    private chart: Partial<ChartOptions>;
    public monitorConfiguration: Monitor = new Monitor();
    private firstSimulation: boolean = true;

    constructor() {}

    ngOnInit(): void {
        this.createDynamicChart();
        this.simulateCurve();
    }

    ngOnDestroy() {
        clearInterval(this.simulationTimer);
    }

    /**
     * Create dynamic chart (for simulation)
     */
    private createDynamicChart(): void {
        if (this.curves.curveValues.length > 0) {
            const maxY: number =
                this.curvesHelper.getMaxY(this.curves.curveValues) + 1;
            const minY: number =
                this.curvesHelper.getMinY(this.curves.curveValues) - 1;
            const chart: ChartConfigurer = new ChartConfigurer({
                colorLine: this.curves.curveConfiguration.colorLine,
                height: 100,
                minX: 0,
                maxX: this.monitorConfiguration.getMonitorConfiguration()
                    .maxSamples,
                minY: minY,
                maxY: maxY,
                toolbar: false,
            });
            let type: ChartType = null;

            if (this.curves.curveConfiguration.label == "etCO2") type = "area";

            chart.setChart([], type);

            this.chart = chart.getChart();
        }
    }

    private simulateCurve(): void {
        this.initCurveTimers();

        this.simulationTimer = setInterval(() => {
            this.updateTimer();
            this.initiateSimulation();
            this.timer += this.breathCurve
                ? this.monitorConfiguration.getMonitorConfiguration()
                      .freqSampleBreath / 1000
                : this.monitorConfiguration.getMonitorConfiguration()
                      .freqSampleHeart / 1000;
            this.curveTimer = this.roundTimer(
                this.curveTimer +
                    this.curvesHelper.calculateRate(
                        this.rate,
                        this.breathCurve
                            ? this.monitorConfiguration.getMonitorConfiguration()
                                  .freqSampleBreath
                            : this.monitorConfiguration.getMonitorConfiguration()
                                  .freqSampleHeart
                    )
            );
            this.updateChart(this.chartComponent.series);
        }, this.monitorConfiguration.getMonitorConfiguration().clockTimer);
    }

    public getChart(): Partial<ChartOptions> {
        return this.chart;
    }

    private initCurveTimers(): void {
        if (this.curves.curveValues.length > 0) {
            this.curveTimer = 0;
            const maxValue: number =
                this.curves.curveValues[this.curves.curveValues.length - 1][0];
            this.maxValue = maxValue;
        }
    }

    private updateTimer(): void {
        if (this.firstSimulation) {
            if (
                this.timer >=
                this.monitorConfiguration.getMonitorConfiguration().maxSamples
            ) {
                this.timer = 0.0;
                this.firstSimulation = false;
                // At this point, the first simulation end, so we create a new dataset for all curves where
                // we're going to push the simulation data.
                this.createSimulationDataset();
            }
        } else {
            if (
                this.timer >=
                this.monitorConfiguration.getMonitorConfiguration().maxSamples
            ) {
                this.timer = 0.0;
                // At this point, the clock timer overcomes monitor max samples, so we need to
                // "restart" simulation
                this.swapCurves();
            }
        }
    }

    private createSimulationDataset() {
        const currentDataset: any = this.chart.series;
        if (currentDataset)
            currentDataset.push({
                data: [],
                color: currentDataset[0].color,
            });
    }

    /**
     * Swap curves between simulation data and current dataset. Old dataset will be the previous
     * simulation dataset, and new dataset will start empty
     */
    private swapCurves(): void {
        if (this.curves.curveValues.length > 0) {
            const currentDataset: any = this.chart.series;
            const auxDataset: [number, number][] = currentDataset[1].data;
            currentDataset[0].data = auxDataset;
            currentDataset[1].data = [];
            this.updateChart(currentDataset);
        }
    }

    /**
     * Update all Apex Charts
     */
    private updateChart(chartDataset: ApexAxisChartSeries | any): void {
        const chart: ChartComponent = this.chartComponent;
        if (chart) chart.updateSeries(chartDataset, false);
    }

    private initiateSimulation(): void {
        this.updateCurveTimer();
        if (this.firstSimulation) {
            this.updateDataset();
        } else {
            if (this.chartComponent.series) {
                const currentDataset: any = this.chartComponent.series.slice();
                this.updateDatasetSimulation(currentDataset);
            }
        }
    }

    private updateDataset(): void {
        const currentDataset: any = this.chart?.series.slice();
        if (currentDataset) {
            const curveTimer: number = this.curveTimer;
            let closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(
                this.curves.curveValues,
                curveTimer
            );
            const interpolationNumber: number =
                this.curvesHelper.linealInterpolation(
                    closestIndex.lessValue[0],
                    closestIndex.greaterValue[0],
                    curveTimer,
                    closestIndex.lessValue[1],
                    closestIndex.lessValue[1]
                );
            currentDataset[0].data.push([this.timer, interpolationNumber]);
        }
    }

    /**
     * Update all values on currentDataset for the simulation
     * @param currentDataset
     * @param index
     */
    private updateDatasetSimulation(currentDataset: any): void {
        let curveValues = currentDataset[0].data;
        let curveValuesSimulation = currentDataset[1].data;
        const originalDataset: [number, number][] = this.curves.curveValues;
        let closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(
            originalDataset,
            this.curveTimer
        );
        const interpolationNumber: number =
            this.curvesHelper.linealInterpolation(
                closestIndex.lessValue[0],
                closestIndex.greaterValue[0],
                this.curveTimer,
                closestIndex.lessValue[1],
                closestIndex.lessValue[1]
            );
        curveValuesSimulation.push([this.timer, interpolationNumber]);
        this.deleteOldPoints(curveValues, this.timer);
        currentDataset[0].data = curveValues;
        currentDataset[1].data = curveValuesSimulation;
    }

    private updateCurveTimer(): void {
        const curveTimer: number = this.curveTimer;
        const lastItem: number = this.maxValue;
        if (lastItem && curveTimer > lastItem) {
            this.curveTimer = 0.0;
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
}
