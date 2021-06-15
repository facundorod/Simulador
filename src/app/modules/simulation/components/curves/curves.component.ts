import { Component, OnInit, Input } from "@angular/core";
import { ECharts, EChartsOption } from "echarts";
import { NgxEchartsDirective } from "ngx-echarts";
import { ChartConfigurer } from "../../helpers/chartConfigurer";

@Component({
    selector: "app-curves",
    templateUrl: "./curves.component.html",
    styleUrls: ["./curves.component.css"],
})
export class CurvesComponent implements OnInit {
    @Input() series: number[][] = null;
    @Input() colorLine: string;
    @Input() loadOptions: NgxEchartsDirective["initOpts"] = { height: 100 };
    @Input() simulation: boolean = true;
    @Input() minX: number = 0;
    @Input() maxX: number;
    @Input() minY: number;
    @Input() maxY: number;
    @Input() type: string = null;
    @Input() maxSamples: number = 4;
    @Input() sampleFrequency: number = 1;
    @Input() stop: boolean;
    private iterator: number = 0;
    public chartOption: EChartsOption;
    private echartsInstance: ECharts;
    private seriesAux: number[][] = new Array<number[]>(new Array<number>());
    private simulationTimer: NodeJS.Timeout;
    constructor() { }

    ngOnInit(): void {
        const chartConfigurer: ChartConfigurer = new ChartConfigurer(
            this.simulation ? this.seriesAux : this.series,
            this.colorLine,
            this.minX,
            this.simulation ? this.maxSamples : this.maxX,
            this.minY,
            this.maxY,
            this.simulation,
            this.type
        );
        if (this.series) {
            this.chartOption = chartConfigurer.getChart();
            this.chartOption.series[0].data = this.simulation ? this.seriesAux : this.series;
            if (this.simulation && !this.stop) {
                this.simulationTimer = setInterval(() => {
                    this.simulateCurve();
                    this.updateChart();
                }, this.sampleFrequency * 75);
            }
        }

    }

    ngOnDestroy() {
        clearInterval(this.simulationTimer);
    }


    public onChartInit(e: ECharts): void {
        this.echartsInstance = e;
        this.echartsInstance.setOption(this.chartOption);
    }

    private simulateCurve(): void {
        if (this.iterator >= this.series.length) this.updateIterator();
        else
            if (this.series.length > 0) {
                let firstData: number[] = this.series[this.iterator].slice();
                this.seriesAux.push([firstData[0], firstData[1]]);
                this.updateIterator(firstData[0]);
            }
    }

    private updateIterator(firstValue: number = 0): void {
        if (firstValue >= this.maxSamples || this.iterator >= this.series.length) {
            this.seriesAux = [];
            this.updateChart();
            this.iterator = 0;
        } else this.iterator++;
    }

    private updateChart(): void {
        if (this.echartsInstance) {
            this.chartOption.series[0].data = this.seriesAux;
            this.echartsInstance.setOption(this.chartOption);
        }
    }
}



