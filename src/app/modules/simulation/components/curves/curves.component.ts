import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, AfterViewInit } from "@angular/core";
import { ChartConfigurer, ChartOptions } from "../../helpers/chartConfigurer";
import { CurvesI } from "@app/shared/models/curvesI";
import { MonitorI } from "@app/shared/models/monitorI";
import { CurvesHelper } from "../../helpers/curvesHelper";
import { ApexAxisChartSeries, ApexChart, ChartComponent } from "ng-apexcharts";
import * as ApexCharts from "apexcharts";
@Component({
    selector: "app-curves",
    templateUrl: "./curves.component.html",
    styleUrls: ["./curves.component.css"],
})
export class CurvesComponent implements OnInit, AfterViewInit {

    @Input() curves: CurvesI[];
    @Input() simulation: boolean;
    @Input() monitorConfiguration: MonitorI;
    @Input() colorLine: string | undefined;
    @Input() stopCurves: boolean = false;
    @Input() staticCurves: [number, number][] | undefined;
    @ViewChildren('chart') charts: QueryList<ChartComponent>;

    public chartsOptions: Partial<ChartOptions>[] = [];
    private clockTimer: number = 0.0;
    private iterators: number[] = [];
    private firstSimulation: boolean = true;
    public datasetSimulation: ApexAxisChartSeries = [];
    private curvesHelper: CurvesHelper = new CurvesHelper();
    private simulationTimer: NodeJS.Timeout;

    constructor() {

    }


    ngOnInit(): void { }

    ngAfterViewInit(): void {
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
                this.clockTimer += (this.monitorConfiguration.freqSample / 1000);
                this.iterators[index]++;
            });
        }, this.monitorConfiguration.freqSample);
    }

    private simulateCurve(curve: CurvesI, index: number): void {
        if (this.firstSimulation) {
            if (this.clockTimer >= this.monitorConfiguration.maxSamples) {
                this.firstSimulation = false;
                this.clockTimer = 0.0;
            } else {
                const currentDataset: any = this.chartsOptions[index].series;
                if (this.stopCurves) {
                    const roundTimer: number = Math.round(this.clockTimer * 100) / 100;
                    const aux: [number, number][] = curve.curveValues.filter(data => data[0] == roundTimer);
                    currentDataset[0].data.push([aux[0][0], aux[0][1]]);
                } else {

                }
                const chart: ChartComponent = this.charts.toArray()[index];
                chart.updateSeries(currentDataset);
            }
        } else {
            if (this.clockTimer === this.monitorConfiguration.maxSamples)
                this.clockTimer = 0.0;


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
            this.iterators.push(0);
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
}



