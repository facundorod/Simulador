import { EChartsOption } from "echarts";

export class ChartConfigurer {
    protected chartOption: EChartsOption;
    protected chartDataSeries: number[];
    protected chartLabelX: number[];
    protected colorLine: string;
    constructor(
        series: number[],
        labelX: number[],
        colorLine: string = "blue"
    ) {
        this.loadData(series, labelX, colorLine);
        this.chartOption = {
            xAxis: {
                type: "category",
                data: this.chartLabelX,
                show: false,
            },
            yAxis: {
                type: "value",
                show: false,
            },
            series: [
                {
                    data: this.chartDataSeries,
                    type: "line",
                },
            ],
        };
    }

    public loadData(
        series: number[],
        labelX: number[],
        colorLine: string = "blue"
    ): void {
        this.chartDataSeries = series;
        this.chartLabelX = labelX;
        this.colorLine = colorLine;
    }

    public getChart(): EChartsOption {
        return this.chartOption;
    }
}
