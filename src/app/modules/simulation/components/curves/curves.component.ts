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
    @Input() sampleFrequency: number = 0.1;
    num: number = 0;
    chartOption: EChartsOption;
    private echartsInstance: ECharts;

    constructor() { }

    ngOnInit(): void {
        const chartConfigurer = new ChartConfigurer(
            this.series,
            this.colorLine,
            this.minX,
            this.maxX,
            this.minY,
            this.maxY,
            this.simulation,
            this.type
        );
        this.chartOption = chartConfigurer.getChart();
        if (this.simulation) {
            // setInterval(() => {
            //     // this.scaleCurve();
            //     // this.chartOption.series[0].data = this.series;
            //     this.echartsInstance.setOption(this.chartOption);
            //     // this.num += 1;
            // }, 50);
        }
    }

    onChartInit(e: any) {
        this.echartsInstance = e;
        this.echartsInstance.setOption(this.chartOption);
    }

    scaleCurve() {
        if (this.series.length > 0) {
            const firstData = this.series[0];
            this.series.push([
                firstData[0] + this.sampleFrequency,
                firstData[1],
            ]);
            this.series.splice(0, 1);
        }
    }
}
