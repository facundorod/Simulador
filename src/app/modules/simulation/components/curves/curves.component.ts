import { Component, OnInit, Input, ViewChildren, QueryList, AfterContentInit } from "@angular/core";
import { ChartConfigurer, ChartOptions } from "../../helpers/chartConfigurer";
import { CurvesI } from "@app/shared/models/curvesI";
import { MonitorI } from "@app/shared/models/monitorI";
import { CurvesHelper } from "../../helpers/curvesHelper";
import { ChartComponent } from "ng-apexcharts";
import { ClosestPoint } from '@app/modules/simulation/helpers/curvesHelper';
@Component({
    selector: "app-curves",
    templateUrl: "./curves.component.html",
    styleUrls: ["./curves.component.css"],
})
export class CurvesComponent implements OnInit, AfterContentInit {

    @Input() curves: CurvesI[];
    @Input() simulation: boolean;
    @Input() monitorConfiguration: MonitorI;
    @Input() colorLine: string | undefined;
    @Input() stopCurves: boolean = false;
    @Input() staticCurves: [number, number][] | undefined;
    @ViewChildren('chart') charts: QueryList<ChartComponent>;

    public chartsOptions: Partial<ChartOptions>[] = [];
    private clockTimer: number = 0.0;
    private firstSimulation: boolean = true;
    private curvesHelper: CurvesHelper = new CurvesHelper();
    private simulationTimer: NodeJS.Timeout;
    private curveTimer: number = 0.0;

    constructor() { }

    ngAfterContentInit(): void {

    }

    ngOnInit(): void {
        if (this.staticCurves) {
            this.createStaticChart();
        } else {
            this.createDynamicChart();
            this.simulateCurves();
        }
    }

    ngOnDestroy() {
        clearInterval(this.simulationTimer);
    }

    /**
     * Simulate all curves
     */
    private simulateCurves() {
        this.simulationTimer = setInterval(() => {
            this.curves.forEach((curve: CurvesI, index: number) => {
                this.simulateCurve(curve, index);
            });
            this.clockTimer += (this.monitorConfiguration.freqSample / 1000);
            this.curveTimer += (this.monitorConfiguration.freqSample / 1000);
        }, 60);
    }

    private simulateCurve(curve: CurvesI, index: number): void {
        this.updateClockTimer();
        if (this.firstSimulation) {
            this.updateCurveTimer(curve.curveValues);
            this.updateDataset(index, curve.curveValues);
        } else {
            const currentDataset: any = this.chartsOptions[index].series;
            this.updateCurveTimer(currentDataset[0].data);
            this.updateDatasetSimulation(currentDataset, index);
        }
    }

    /**
     * Create dynamic chart (for simulation)
     */
    private createDynamicChart(): void {
        this.curves.forEach((curve: CurvesI) => {
            const maxY: number = this.curvesHelper.getMaxY(curve.curveValues) + 1;
            const minY: number = this.curvesHelper.getMinY(curve.curveValues) - 1;
            const chart: ChartConfigurer = new ChartConfigurer({
                colorLine: curve.curveConfiguration.colorLine,
                height: 100,
                minX: 0,
                maxX: this.monitorConfiguration.maxSamples,
                minY: minY,
                maxY: maxY,
                toolbar: false
            });
            chart.setChart([]);

            this.chartsOptions.push(chart.getChart());
        });
    }

    /**
     * Create static chart (without simulation)
     */
    private createStaticChart(): void {

        const maxY: number = this.curvesHelper.getMaxY(this.staticCurves);
        const minY: number = this.curvesHelper.getMinY(this.staticCurves);
        const chartConfigurer: ChartConfigurer = new ChartConfigurer({
            colorLine: this.colorLine,
            height: 100,
            minX: 0,
            maxX: 1,
            minY: minY,
            maxY: maxY,
            toolbar: true
        });
        chartConfigurer.setChart(this.staticCurves);
        this.chartsOptions.push(chartConfigurer.getChart());
    }

    /**
     * Update the dataset for the first simulation (until clock timer overcomes max samples value)
     * @param index
     * @param curveValues
     */
    private updateDataset(index: number, curveValues: [number, number][]): void {
        const currentDataset: any = this.chartsOptions[index].series;
        const roundTimer: number = Math.round(this.curveTimer * 10000) / 10000;
        const roundClockTimer: number = Math.round(this.clockTimer * 10000) / 10000;
        // Find roundTimer in the xAxis (current dataset)
        const aux: [number, number][] = curveValues.filter(data => (Math.round(data[0] * 10000) / 10000) == roundTimer);
        if (aux.length > 0) {
            currentDataset[0].data.push([roundClockTimer, aux[0][1]]);
        } else {
            // If the value (clockTimer) doesn't exist in the original dataset, we need to interpolate it
            let closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(curveValues, roundTimer);
            const interpolationNumber: number = this.curvesHelper.linealInterpolation(closestIndex.lessValue[0],
                closestIndex.greaterValue[0], roundTimer, closestIndex.lessValue[1], closestIndex.lessValue[1]);
            currentDataset[0].data.push([roundClockTimer, interpolationNumber]);
        }
        this.updateChart(currentDataset, index);

    }

    /**
     * Update all values on currentDataset for the simulation
     * @param currentDataset
     * @param index
     */
    private updateDatasetSimulation(currentDataset: any, index: number): void {
        let curveValues = currentDataset[0].data;
        let curveValuesSimulation = currentDataset[1].data;

        const roundClockTimer: number = Math.round(this.clockTimer * 10000) / 10000;
        const roundTimer: number = Math.round(this.curveTimer * 10000) / 10000;
        let indexToDelete: number, indexToInsert: number = -1;
        curveValues.forEach((value: [number, number], index: number) => {
            const valueRound: number = Math.round(value[0] * 10000) / 10000
            if (valueRound === roundClockTimer)
                indexToDelete = index;
            if (valueRound === roundTimer)
                indexToInsert = index;
        })
        if (indexToInsert != -1 && indexToDelete != -1) {
            curveValuesSimulation.push([roundClockTimer, curveValues[indexToInsert][1]]);
            curveValues.splice(indexToDelete, 1);
            this.updateChart(currentDataset, index);
        } else {
            curveValuesSimulation.push([roundClockTimer, curveValuesSimulation[0][1]]);
            curveValues.splice(indexToDelete, 1);
            this.updateChart(currentDataset, index);
        }
    }

    /**
     * Update curve timer. If the curve timer overcome the last item in the dataset, then
     * curve timer go back to 0.
     * @param curveValues
     */
    private updateCurveTimer(curveValues: [number, number][]): void {
        const roundTimer: number = Math.round(this.curveTimer * 10000) / 10000;
        const lastItem: number[] | undefined = curveValues[curveValues.length - 1];
        if (lastItem && roundTimer > lastItem[0]) {
            this.curveTimer = 0.0;
        }

    }

    /**
     * Update clock timer and update if the first simulation is completed:
     * If clockTimer overcome monitor's max samples, then clockTimer = 0.0
     */
    private updateClockTimer(): void {
        if (this.firstSimulation) {
            if (this.clockTimer > this.monitorConfiguration.maxSamples) {
                this.clockTimer = 0.0;
                this.firstSimulation = false;
                // At this point, the first simulation end, so we create a new dataset for all curves where
                // we'll push the simulation data.
                this.createSimulationDataset();
            }
        } else {
            if (this.clockTimer > this.monitorConfiguration.maxSamples) {
                this.clockTimer = 0.0;
                // At this point, the clock timer overcomes monitor max samples, so we need to
                // "restart" simulation
                this.swapCurves();
            }
        }
    }

    /**
     * Swap curves between simulation data and current dataset. Old dataset will be the previous
     * simulation dataset, and new dataset will start empty
     */
    private swapCurves(): void {
        for (let index = 0; index < this.curves.length; index++) {
            const currentDataset: any = this.chartsOptions[index].series;
            const auxDataset: [number, number][] = currentDataset[1].data;
            currentDataset[0].data = auxDataset;
            currentDataset[1].data = [];
        }

    }

    /**
     * Sort all dataset values
     * @param curveValues
     */
    private sortDataset(curveValues: [number, number][]): void {
        curveValues.sort((a: [number, number], b: [number, number]) => {
            return a[0] - b[0];
        });
    }

    /**
     * Update chart with the @param dataset
     * @param dataset
     * @param index
     */
    private updateChart(dataset: any, index: number): void {
        const chart: ChartComponent = this.charts.toArray()[index];
        chart.updateSeries(dataset, false);
    }

    /**
     * Create simulation dataset for all curves
     */
    private createSimulationDataset(): void {

        for (let index = 0; index < this.curves.length; index++) {
            const currentDataset: any = this.chartsOptions[index].series;
            currentDataset.push({
                data: [],
                color: currentDataset[0].color,
            });
        }
    }
}



