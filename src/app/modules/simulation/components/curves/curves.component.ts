import { Component, OnInit, Input } from "@angular/core";
import { ECharts, EChartsOption } from "echarts";
import { ChartConfigurer } from "../../helpers/chartConfigurer";

@Component({
    selector: "app-curves",
    templateUrl: "./curves.component.html",
    styleUrls: ["./curves.component.css"],
})
export class CurvesComponent implements OnInit {
    @Input() series: number[][] = [
        [0, 1],
        [2, 3],
    ];
    @Input() colorLine: string;
    @Input() minX: number;
    @Input() maxX: number;
    @Input() minY: number;
    @Input() maxY: number;

    chartOption: EChartsOption;
    private echartsInstance: ECharts;

    constructor() {}

    ngOnInit(): void {
        const chartConfigurer = new ChartConfigurer(
            this.series,
            this.colorLine,
            this.minX,
            this.maxX,
            this.minY,
            this.maxY
        );

        this.chartOption = chartConfigurer.getChart();
        // setInterval(() => {
        //     this.chartOption.series[0].data = this.series2;
        //     this.chartOption.series[1].data = this.series;
        //     this.echartsInstance.setOption(this.chartOption);
        // }, 3000);
    }

    onChartInit(e: any) {
        this.echartsInstance = e;
        this.echartsInstance.setOption(this.chartOption);
    }
}
