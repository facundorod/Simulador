import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
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
    @Input() action: string = "stop";
    @Input() rate: number;
    private simulationTimer: NodeJS.Timeout;
    private timer: number = 0.0;
    private currentIndex: number = 0;
    private maxSize: number = 51;
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
                this.curvesHelper.getMaxY(this.curves.curveValues);
            const minY: number =
                this.curvesHelper.getMinY(this.curves.curveValues);
            const chart: ChartConfigurer = new ChartConfigurer({
                colorLine: this.curves.curveConfiguration.colorLine,
                height: 100,
                minX: 0,
                maxX: 3,
                minY: minY >= 0 ? -1 : minY,
                maxY: maxY,
                toolbar: false,
            });
            let type: ChartType = null;

            if (
                this.action !== "stop" &&
                    this.curves.curveConfiguration.label.toUpperCase() === "CO2")
                type = "area";

            chart.setChart([], type);

            this.chart = chart.getChart();
        }
    }

    private simulateCurve(): void {

        this.simulationTimer = setInterval(() => {
            this.updateTimer();
            this.updateCurrentIndex();

            if (this.action !== "pause") {
                this.initiateSimulation();
                this.timer += this.breathCurve
                    ? this.monitorConfiguration.getMonitorConfiguration()
                          .freqBreath / 1000
                    : this.monitorConfiguration.getMonitorConfiguration()
                          .freqHeart / 1000;
            }
            this.currentIndex += 1;
            this.updateChart(this.chartComponent.series);
        }, 30);
    }

    public getChart(): Partial<ChartOptions> {
        return this.chart;
    }



    private updateTimer(): void {
        if (this.firstSimulation) {
            if (this.timer >= 3) {
                this.timer = 0.0;
                this.firstSimulation = false;
                // At this point, the first simulation end, so we create a new dataset for all curves where
                // we're going to push the simulation data.
                this.createSimulationDataset();
            }
        } else {
            if (this.timer >= 3) {
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
            if (this.action === "stop") {
                const minY: number | any = this.chart.yaxis.min;
                const maxY: number | any = this.chart.yaxis.max;
                currentDataset[0].data.push([this.timer, (minY + maxY) / 2]);
            } else
                currentDataset[0].data.push([this.timer, this.curves.curveValues[this.currentIndex][1]]);

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
        if (this.action === "stop") {
            const minY: number | any = this.chart.yaxis.min;
            const maxY: number | any = this.chart.yaxis.max;
            curveValuesSimulation.push([this.timer, (minY + maxY) / 2]);
        } else {
            curveValuesSimulation.push([this.timer, this.curves.curveValues[this.currentIndex][1]]);
        }
        this.deleteOldPoints(curveValues, this.timer);
        currentDataset[0].data = curveValues;
        currentDataset[1].data = curveValuesSimulation;
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
     * Update currentIndex. If the currentIndex overcome the last item in the dataset, then
     * currentIndex go back to 0.
     * @param curveValues
     */
      private updateCurrentIndex(): void {
        if (this.currentIndex >= this.maxSize) {
            this.currentIndex = 0;
        }
    }
}
