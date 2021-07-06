import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, AfterViewInit, AfterContentInit } from "@angular/core";
import { ChartConfigurer, ChartOptions } from "../../helpers/chartConfigurer";
import { CurvesI } from "@app/shared/models/curvesI";
import { MonitorI } from "@app/shared/models/monitorI";
import { CurvesHelper } from "../../helpers/curvesHelper";
import { ApexAxisChartSeries, ApexChart, ChartComponent } from "ng-apexcharts";
import * as ApexCharts from "apexcharts";
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

    constructor() {

    }

    ngAfterContentInit(): void {
        if (this.staticCurves) {
            this.createStaticChart();
        } else {
            this.createDynamicChart();
            this.simulateCurves();
        }
    }


    ngOnInit(): void { }

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
        }, 50);
    }

    private simulateCurve(curve: CurvesI, index: number): void {
        if (this.clockTimer >= this.monitorConfiguration.maxSamples) {
            this.firstSimulation = false;
            this.clockTimer = 0.0;
        }
        this.updateDataset(index, curve.curveValues);

    }

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

    private createStaticChart(): void {

        const maxY: number = this.curvesHelper.getMaxY(this.staticCurves);
        const minY: number = this.curvesHelper.getMinY(this.staticCurves);
        let chart: ApexChart;
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

        // this.chartsOptions.push(chart.getChart());
    }

    private updateDataset(index: number, curveValues: [number, number][]): void {
        const currentDataset: any = this.chartsOptions[index].series;
        const roundTimer: number = Math.round(this.curveTimer * 100) / 100;

        if (roundTimer >= curveValues[curveValues.length - 1][0]) {
            this.curveTimer = 0.0;
        } else {
            const aux: [number, number][] = curveValues.filter(data => (Math.round(data[0] * 100) / 100) == roundTimer);
            if (aux.length > 0) {
                if (!this.firstSimulation)
                    currentDataset[0].data.splice(this.clockTimer, 1);
                currentDataset[0].data.push([this.clockTimer, aux[0][1]]);
            } else {
                const closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(curveValues, roundTimer);
                const interpolationNumber: number = this.curvesHelper.linealInterpolation(closestIndex.lessValue[0],
                    closestIndex.greaterValue[0], roundTimer, closestIndex.lessValue[1], closestIndex.lessValue[1]);
                if (!this.firstSimulation)
                    currentDataset[0].data.splice(Math.round(this.clockTimer * 100) / 100, 1);

                currentDataset[0].data.push([Math.round(this.clockTimer * 100) / 100, interpolationNumber]);

            }

            const chart: ChartComponent = this.charts.toArray()[index];
            chart.updateSeries(currentDataset);
        }

    }

    private updateDatasetSimulation(index: number, curveValues: [number, number][]): void {
        const currentDataset: any = this.chartsOptions[index].series;
        const roundTimer: number = Math.round(this.curveTimer * 100) / 100;
        const contTimer: number = Math.round(roundTimer + (this.monitorConfiguration.freqSample / 1000)) / 100;
        const aux: [number, number][] = curveValues.filter(data => (Math.round(data[0] * 100) / 100) == contTimer);
        if (aux.length > 0) {
            currentDataset[0].data.push([aux[0][0], aux[0][1]]);
        } else {
            const closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(curveValues, roundTimer);
            const interpolationNumber: number = this.curvesHelper.linealInterpolation(closestIndex.lessValue[0],
                closestIndex.greaterValue[0], roundTimer, closestIndex.lessValue[1], closestIndex.lessValue[1]);
            currentDataset[0].data.push([roundTimer, interpolationNumber]);
        }
        const chart: ChartComponent = this.charts.toArray()[index];
        chart.updateSeries(currentDataset);
        // if (this.curves[index].curveConfiguration.id_pp = 1)
        //     console.log("countTimer", contTimer);

    }
}



