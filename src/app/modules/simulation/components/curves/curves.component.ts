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
    private number: number = 0;
    public chartOption: EChartsOption;
    private echartsInstance: ECharts;

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
        if (this.colorLine === '#6DC0EC')
            this.number++;
        this.chartOption = chartConfigurer.getChart();
        if (this.simulation) {
            setInterval(() => {
                this.scaleCurve();
                this.chartOption.series[0].data = this.series;
                this.echartsInstance.setOption(this.chartOption);

            }, this.sampleFrequency * 100);
            // if (this.colorLine === '#6DC0EC')
            //     console.log("AAAAAAAAA", this.series.length);
        }
    }

    public onChartInit(e: ECharts): void {
        this.echartsInstance = e;
        this.echartsInstance.setOption(this.chartOption);
    }

    private scaleCurve(): void {
        if (this.series.length > 0) {
            const firstData: number[] = this.series[0];
            this.series.push([
                firstData[0] + this.sampleFrequency,
                firstData[1],
            ]);
            if (this.colorLine === '#6DC0EC') {
                console.log("Iteración", this.number);
                console.log("longitud", this.series.length);
            }
            // this.series.splice(0, 1);
            // Sort array
            this.series.sort((a: number[], b: number[]) => {
                return a[0] - b[0];
            });
        }
    }
}
