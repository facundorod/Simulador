import { Component, OnInit, Input, ViewChildren, QueryList, AfterContentInit, AfterViewInit, AfterViewChecked, HostListener, AfterContentChecked, Renderer2, ElementRef, OnChanges, ChangeDetectorRef } from "@angular/core";
import { ChartConfigurer, ChartOptions } from "../../helpers/chartConfigurer";
import { CurvesI } from "@app/shared/models/curvesI";
import { MonitorI } from "@app/shared/models/monitorI";
import { CurvesHelper } from "../../helpers/curvesHelper";
import { ApexAxisChartSeries, ChartComponent } from "ng-apexcharts";
import { ClosestPoint } from '@app/modules/simulation/helpers/curvesHelper';
import { StatesI } from "@app/shared/models/stateI";
import { ParameterInfoI } from "@app/shared/models/parameterInfoI";

@Component({
    selector: "app-curves",
    templateUrl: "./curves.component.html",
    styleUrls: ["./curves.component.css"],
})
export class CurvesComponent implements OnInit, AfterViewInit {

    @Input() currentState: StatesI;
    @Input() simulation: boolean;
    @Input() monitorConfiguration: MonitorI;
    @Input() colorLine: string | undefined;
    @Input() stopCurves: boolean = false;
    @Input() staticCurves: [number, number][] | undefined;
    @ViewChildren('chart') charts: QueryList<ChartComponent>;
    public chartsOptions: Partial<ChartOptions>[];
    private clockTimer: number;
    private curveTimers: number[];
    // Max values for each curve. This value contains the last element (in seconds) for
    // the curve on the interval [0-100%]
    private maxValues: number[];
    private firstSimulation: boolean;
    private curvesHelper: CurvesHelper = new CurvesHelper();
    private simulationTimer: NodeJS.Timeout;
    constructor() {
        this.initVariables();
    }


    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        if (this.currentState) {
            this.initCurveTimers();
            if (!this.staticCurves) {
                this.createDynamicChart();
                this.simulateCurves();
            } else {
                this.createStaticChart();
            }
        }
    }


    private initVariables(): void {
        this.clockTimer = 0.0;
        this.firstSimulation = true;
        this.curveTimers = [];
        this.maxValues = [];
        this.chartsOptions = [];
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

    ngOnDestroy() {
        clearInterval(this.simulationTimer);
        this.charts.forEach((chart: ChartComponent) => {
            chart.destroy();
        })
    }

    /**
     * Simulate all curves
     */
    private simulateCurves() {
        this.simulationTimer = setInterval(() => {
            this.updateClockTimer();
            this.currentState?.curves.forEach((curve: CurvesI, index: number) => {
                if (curve.curveValues.length > 0) {
                    this.simulateCurve(curve, index);
                    this.curveTimers[index] += (this.monitorConfiguration.freqSample / 1000);
                }
            });
            this.clockTimer += (this.monitorConfiguration.freqSample / 1000);
        }, this.monitorConfiguration.clockTimer);
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
                    maxX: this.monitorConfiguration.maxSamples,
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
        const currentDataset: any = this.chartsOptions[index].series.slice();
        const curveTimer: number = this.curveTimers[index];
        const roundClockTimer: number = this.clockTimer;
        let closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(curveValues, curveTimer);
        const interpolationNumber: number = this.curvesHelper.linealInterpolation(closestIndex.lessValue[0],
            closestIndex.greaterValue[0], curveTimer, closestIndex.lessValue[1], closestIndex.lessValue[1]);
        currentDataset[0].data.push([roundClockTimer, interpolationNumber]);
        this.updateChart(currentDataset, index, true);
    }

    /**
     * Update all values on currentDataset for the simulation
     * @param currentDataset
     * @param index
     */
    private updateDatasetSimulation(currentDataset: any, index: number): void {
        let curveValues = currentDataset[0].data;
        let curveValuesSimulation = currentDataset[1].data;
        const roundTimer: number = this.curveTimers[index];
        let indexToDelete = this.getIndex(curveValues, this.clockTimer);
        const originalDataset: [number, number][] = this.currentState.curves[index].curveValues;
        let closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(originalDataset, roundTimer);
        const interpolationNumber: number = this.curvesHelper.linealInterpolation(closestIndex.lessValue[0],
            closestIndex.greaterValue[0], roundTimer, closestIndex.lessValue[1], closestIndex.lessValue[1]);
        curveValues.splice(indexToDelete, 1);
        curveValuesSimulation.push([this.clockTimer, interpolationNumber]);
        this.updateChart(currentDataset, index, true);
    }

    private getIndex(curveValues: [number, number][], roundClockTimer: number): number {
        let indexToDelete: number = -1;
        curveValues.forEach((value: [number, number], index: number) => {
            const valueRound: number = value[0];
            if (valueRound === roundClockTimer) {
                indexToDelete = index;
                return;
            }

        });
        return indexToDelete;
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
     * Round timer
     * @param timer
     * @returns
     */
    private roundTimer(timer: number): number {
        return Math.round(timer * 10000) / 10000;
    }

    /**
     * Update clock timer and update if the first simulation is completed:
     * If clockTimer overcome monitor's max samples, then clockTimer = 0.0
     */
    private updateClockTimer(): void {
        if (this.firstSimulation) {
            if (this.clockTimer >= this.monitorConfiguration.maxSamples) {
                this.clockTimer = 0.0;
                this.firstSimulation = false;
                // At this point, the first simulation end, so we create a new dataset for all curves where
                // we're going to push the simulation data.
                this.createSimulationDataset();
            }
        } else {
            if (this.clockTimer >= this.monitorConfiguration.maxSamples) {
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
     * Update all Apex Charts
     */
    private updateChart(chartDataset: ApexAxisChartSeries, index: number, animate: boolean = true): void {

        const chart: ChartComponent = this.charts.toArray()[index];
        if (chart) {
            chart.updateSeries(chartDataset, animate);
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

    /**
     * Return the curve color
     * @param curve
     * @returns
     */
    public getColor(curve: CurvesI): string {
        return curve.curveConfiguration.colorLine;
    }

    public getSourceRateValue(curve: CurvesI): number {
        const parameterInfo: ParameterInfoI = JSON.parse(localStorage.getItem('parameterState'));
        switch (curve.curveConfiguration.source.label.toUpperCase()) {
            case 'CAR':
                return parameterInfo.heartRate;
            case 'RESP':
                return parameterInfo.breathRate;
            case 'SPO2':
                return parameterInfo.spO2;
            default:
                break;
        }
    }
}



