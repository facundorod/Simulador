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
    @Input() loadOptions: any = { height: 300 };
    @Input() simulation: boolean = true;
    @Input() minX: number;
    @Input() maxX: number;
    @Input() minY: number;
    @Input() maxY: number;
    num: number = 0;
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
            this.maxY,
            this.simulation
        );

        this.chartOption = chartConfigurer.getChart();
        if (this.simulation)
            setInterval(() => {
                if (this.num > 4) {
                    clearInterval();
                    return;
                }
                // this.chartOption.series[0].data = [];
                // this.echartsInstance.setOption(this.chartOption);
                this.scaleCurve();
                this.chartOption.series[0].data = this.series;
                this.echartsInstance.setOption(this.chartOption);
                this.num += 1;
            }, 3000);
    }

    onChartInit(e: any) {
        this.echartsInstance = e;
        this.echartsInstance.setOption(this.chartOption);
    }

    scaleCurve() {
        let aux: number[][] = [[]];

        this.series.forEach((data: number[]) => {
            aux.push([data[0] + 1.0, data[1]]);
        });

        this.series = this.series.concat(aux);
    }
}
