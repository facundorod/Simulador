import { Component, OnInit, Input } from "@angular/core";
import { ECharts, EChartsOption } from "echarts";
import { ChartConfigurer } from "../../helpers/chartConfigurer";

@Component({
    selector: "app-curves",
    templateUrl: "./curves.component.html",
    styleUrls: ["./curves.component.css"],
})
export class CurvesComponent implements OnInit {
    @Input() series: number[][] = null;
    @Input() colorLine: string;
    @Input() loadOptions: any = { height: 100 };
    @Input() simulation: boolean = true;
    @Input() minX: number;
    @Input() maxX: number;
    @Input() minY: number;
    @Input() maxY: number;
    @Input() type: string = null;
    @Input() maxSamples: number = 4;
    @Input() sampleFrequency: number = 1;
    private iterator: number = 0;
    public chartOption: EChartsOption;
    private echartsInstance: ECharts;
    private seriesAux: number[][];
    private simulationTimer: NodeJS.Timeout;
    constructor() { }

    ngOnInit(): void {
        const chartConfigurer: ChartConfigurer = new ChartConfigurer(
            this.series,
            this.colorLine,
            this.minX,
            this.maxX,
            this.minY,
            this.maxY,
            this.simulation,
            this.type
        );
        if (this.series) {
            this.seriesAux = this.series.slice();
            this.chartOption = chartConfigurer.getChart();
            this.chartOption.series[0].data = this.series;
            if (this.simulation) {
                this.simulationTimer = setInterval(() => {
                    this.scaleCurve();
                    this.updateChart();
                }, this.sampleFrequency * 100);

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

    private scaleCurve(): void {

        if (this.series.length > 0) {
            const firstData: number[] = this.series[this.iterator];
            this.series.push([
                firstData[0] + this.sampleFrequency,
                firstData[1],
            ])
            this.updateIterator(firstData[0]);
            // Sort array
            this.series.sort((a: number[], b: number[]) => {
                return a[0] - b[0];
            });

        }
    }

    private updateIterator(firstValue: number): void {
        if (firstValue >= this.maxSamples) {
            this.series = [];
            this.series = this.seriesAux.slice();
            this.updateChart();
            this.iterator = 0;
        } else this.iterator++;
    }

    private updateChart(): void {
        if (this.echartsInstance) {
            this.chartOption.series[0].data = this.series;
            this.echartsInstance.setOption(this.chartOption);
        }
    }
}



