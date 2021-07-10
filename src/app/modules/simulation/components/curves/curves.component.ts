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

    constructor() { }

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
        }, 80);
    }

    private simulateCurve(curve: CurvesI, index: number): void {
        if (this.firstSimulation) {
            if (this.clockTimer > this.monitorConfiguration.maxSamples) {
                this.firstSimulation = false;
                this.clockTimer = 0.0;
            } else
                this.updateDataset(index, curve.curveValues);
        } else {
            if (this.clockTimer > this.monitorConfiguration.maxSamples) {
                this.clockTimer = 0.0;

            }
            const currentDataset: any = this.chartsOptions[index].series;
            this.updateDatasetSimulation(currentDataset, index);

        }


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

        this.chartsOptions.push(chartConfigurer.getChart());
    }

    private updateDataset(index: number, curveValues: [number, number][]): void {
        const currentDataset: any = this.chartsOptions[index].series;
        const roundTimer: number = Math.round(this.curveTimer * 10000) / 10000;
        const roundClockTimer: number = Math.round(this.clockTimer * 10000) / 10000;
        if (roundTimer >= curveValues[curveValues.length - 1][0]) {
            this.curveTimer = 0.0;
        }
        // Busco el valor del timer de la curva en el eje x del dataset
        const aux: [number, number][] = curveValues.filter(data => (Math.round(data[0] * 10000) / 10000) == roundTimer);
        if (aux.length > 0) {
            // if (!(roundClockTimer == 0 && currentDataset[0].data.length > 0))
            currentDataset[0].data.push([roundClockTimer, aux[0][1]]);
        } else {
            // Si no existe el valor del timer en todo el dataset, tengo que interpolar
            let closestIndex: ClosestPoint = this.curvesHelper.getClosestIndex(curveValues, roundTimer);
            const interpolationNumber: number = this.curvesHelper.linealInterpolation(closestIndex.lessValue[0],
                closestIndex.greaterValue[0], roundTimer, closestIndex.lessValue[1], closestIndex.lessValue[1]);
            currentDataset[0].data.push([roundClockTimer, interpolationNumber]);

        }
        currentDataset[0].data.sort((a: [number, number], b: [number, number]) => {
            return a[0] - b[0];
        })
        const chart: ChartComponent = this.charts.toArray()[index];
        chart.updateSeries(currentDataset, true);


    }

    private updateDatasetSimulation(currentDataset: any, index: number): void {
        let curveValues = currentDataset[0].data;
        const roundTimer: number = Math.round(this.curveTimer * 10000) / 10000;
        const roundClockTimer: number = Math.round(this.clockTimer * 10000) / 10000;
        const chart: ChartComponent = this.charts.toArray()[index];
        if (roundTimer > curveValues[curveValues.length - 1][0]) {
            this.curveTimer = 0.0;
        }
        let indexToDelete: number, indexToInsert: number = -1;
        curveValues.forEach((value: [number, number], index: number) => {
            const valueRound: number = Math.round(value[0] * 10000) / 10000
            if (valueRound === roundClockTimer)
                indexToDelete = index;
            if (valueRound === roundTimer)
                indexToInsert = index;
        })
        if (indexToInsert != -1) {
            if (this.curves[index].curveConfiguration.id_pp == 1 && this.clockTimer == 4) { debugger; }
            curveValues.push([roundClockTimer, curveValues[indexToInsert][1]]);
            curveValues.splice(indexToDelete, 1);
        }


        curveValues.sort((a: [number, number], b: [number, number]) => {
            return a[0] - b[0];
        })
        chart.updateSeries(currentDataset, true);

    }

}



