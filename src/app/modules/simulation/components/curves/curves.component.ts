import { Component, OnInit, Input } from "@angular/core";
import { EChartsOption } from "echarts";
import { ChartConfigurer } from "../../helpers/chartConfigurer";

@Component({
    selector: "app-curves",
    templateUrl: "./curves.component.html",
    styleUrls: ["./curves.component.css"],
})
export class CurvesComponent implements OnInit {
    @Input() series: number[];
    @Input() labelX: number[];
    @Input() colorLine: string;
    chartOption: EChartsOption;
    constructor() {}

    ngOnInit(): void {
        console.log("HERE");
        const chartConfigurer = new ChartConfigurer(
            this.series,
            this.labelX,
            this.colorLine
        );

        console.log(chartConfigurer);
        this.chartOption = chartConfigurer.getChart();
    }
}
