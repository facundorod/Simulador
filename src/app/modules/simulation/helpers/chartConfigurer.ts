import { EChartsOption } from "echarts";

export class ChartConfigurer {
    protected chartOption: EChartsOption;
    protected chartDataSeries: number[][];
    protected colorLine: string;
    protected chartDataSeries2: number[][];
    constructor(
        series: number[][],
        chartDataSeries2: number[][],
        colorLine: string = "blue"
    ) {
        this.loadData(series, colorLine, chartDataSeries2);
        this.chartOption = {
            xAxis: {
                type: "time",
                // data: this.chartLabelX,
                // show: true,
                // scale: true,
                min: 0,
                max: 2,
                // minInterval: 0,
                // maxInterval: 5,
                // splitNumber: 2,
                interval: 0.1,
            },
            yAxis: {
                type: "value",
                // scale: true,
                interval: 0.001,
                min: -1.26,
                max: 36.0759493670886,
                show: true,
            },
            series: [
                {
                    smooth: true,
                    showSymbol: false,
                    data: this.chartDataSeries,
                    type: "line",
                    color: this.colorLine,
                    areaStyle: {
                        color: this.colorLine,
                    },
                    emphasis: {
                        focus: "series",
                    },
                },
                {
                    smooth: true,
                    showSymbol: false,
                    data: this.chartDataSeries2,
                    type: "line",
                    color: this.colorLine,
                    areaStyle: {
                        color: this.colorLine,
                    },
                    emphasis: {
                        focus: "series",
                    },
                },
            ],
        };
    }

    public loadData(
        series: number[][],
        colorLine: string = "blue",
        chartDataSeries2: number[][]
    ): void {
        this.chartDataSeries = series;
        this.colorLine = colorLine;
        this.chartDataSeries2 = chartDataSeries2;
    }

    public getChart(): EChartsOption {
        return this.chartOption;
    }

    public setData(data: number[][]): void {
        this.chartOption.series[0].data = data;
    }
}
