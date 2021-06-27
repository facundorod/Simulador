import { Component, OnInit, Input } from "@angular/core";
import { ECharts, EChartsOption } from "echarts";
import { NgxEchartsDirective } from "ngx-echarts";
import { ChartConfigurer } from "../../helpers/chartConfigurer";
import * as p5 from 'p5';
import { CurvesI } from "@app/shared/models/curvesI";
import { MonitorI } from "@app/shared/models/monitorI";
import { CurvesHelper } from "../../helpers/curvesHelper";

@Component({
    selector: "app-curves",
    templateUrl: "./curves.component.html",
    styleUrls: ["./curves.component.css"],
})
export class CurvesComponent implements OnInit {

    @Input() curves: CurvesI[];
    @Input() simulation: boolean;
    @Input() monitorConfiguration: MonitorI;
    @Input() colorLine: string | undefined;
    @Input() staticCurves: number[][] | undefined;
    @Input() loadOptions: NgxEchartsDirective["initOpts"];
    public chartOption: EChartsOption | undefined;
    public chartOptions: EChartsOption[] = [];
    public dynamicCharts: EChartsOption[] = this.chartOptions;

    private echarts: ECharts[] = [];
    private clockTimer: number = 0.0;
    private firstSimulation: boolean = true;
    private datasetSimulation: number[][] | undefined = [];
    private curvesHelper: CurvesHelper = new CurvesHelper();
    private simulationTimer: NodeJS.Timeout;

    constructor() {
    }

    ngOnInit(): void {

        if (this.staticCurves) {
            this.createStaticChart();
        } else {
            this.createDynamicCharts();
            this.simulateCurves();
        }

    }

    ngOnDestroy() {
        clearInterval(this.simulationTimer);
    }

    public onChartInit(ec: ECharts): void {
        this.echarts.push(ec);
    }


    /**
     * Simulate all curves
     */
    private simulateCurves() {
        this.simulationTimer = setInterval(() => {
            this.curves.forEach((curve: CurvesI, index: number) => {
                this.simulateCurve(curve);
                this.updateCharts(index);
                this.clockTimer += this.monitorConfiguration.freqSample;
                this.datasetSimulation = [];
            });
        }, this.monitorConfiguration.freqSample);
    }

    private simulateCurve(curve: CurvesI): void {
        if (this.firstSimulation) {
            this.datasetSimulation.push(curve.curveValues[this.clockTimer]);
            if (this.clockTimer === this.monitorConfiguration.maxSamples) {
                this.firstSimulation = false;
                this.clockTimer = 0.0;
            }
        } else {
            const firstData: number[] = curve.curveValues[this.clockTimer].slice();
            firstData[0] += this.monitorConfiguration.freqSample;
            this.datasetSimulation.push(firstData);
            if (this.clockTimer === this.monitorConfiguration.maxSamples)
                this.clockTimer = 0.0;
        }
    }

    private updateCharts(index: number): void {
        let auxChart: EChartsOption = this.dynamicCharts[index];
        let auxEchart: ECharts = this.echarts[index];
        auxChart.series[0].data = this.datasetSimulation;
        auxEchart.setOption(auxChart, false, true);
        this.echarts[index] = auxEchart;
        this.dynamicCharts[index] = auxChart;
    }




    private createDynamicCharts(): void {
        let auxChart: ChartConfigurer;

        this.curves.forEach((curve: CurvesI) => {
            const minY: number = this.curvesHelper.getMinY(curve.curveValues);
            const maxY: number = this.curvesHelper.getMaxY(curve.curveValues);
            auxChart = new ChartConfigurer(this.datasetSimulation, curve.curveConfiguration.colorLine, 0,
                this.monitorConfiguration.maxSamples, minY, maxY, false);
            this.chartOptions.push(auxChart.getChart());
        })
    }

    private createStaticChart(): void {
        const minY: number = this.curvesHelper.getMinY(this.staticCurves);
        const maxY: number = this.curvesHelper.getMaxY(this.staticCurves);
        const auxChart: ChartConfigurer = new ChartConfigurer(this.staticCurves, this.colorLine, 0,
            this.monitorConfiguration.maxSamples, minY, maxY, false);
        this.chartOption = auxChart.getChart();
    }


}



