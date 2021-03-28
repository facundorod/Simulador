import { EChartsOption } from "echarts";

export class ChartConfigurer {
    protected chartOption: EChartsOption;
    protected chartDataSeries: number[][];
    protected colorLine: string;
    protected minX: number;
    protected maxX: number;
    protected minY: number;
    protected maxY: number;

    constructor(
        series: number[][],
        colorLine: string = "blue",
        minX: number,
        maxX: number,
        minY: number,
        maxY: number
    ) {
        this.loadData(series, colorLine, minX, maxX, minY, maxY);
        this.chartOption = {
            xAxis: {
                type: "value",
                min: minX,
                max: maxX,
                show: false,
                // interval: 0.1,
                axisLine: {
                    show: false,
                    onZero: false,
                    lineStyle: {
                        width: 5,
                    },
                },
            },
            yAxis: {
                type: "value",
                // interval: 5,
                min: minY,
                max: maxY,
                show: false,
            },
            series: [
                {
                    smooth: true,
                    showSymbol: false,
                    data: this.chartDataSeries,
                    type: "line",
                    color: this.colorLine,
                    // lineStyle: {
                    //     width: 0,
                    // },
                    // areaStyle: {
                    //     color: this.colorLine,
                    //     origin: "start",
                    // },
                },
            ],
        };
    }

    public loadData(
        series: number[][],
        colorLine: string = "blue",
        minX: number,
        maxX: number,
        minY: number,
        maxY: number
    ): void {
        this.chartDataSeries = series;
        this.colorLine = colorLine;
        this.minX = minX;
        this.maxX = maxX;
        (this.minY = minY), (this.maxY = maxY);
    }

    public getChart(): EChartsOption {
        return this.chartOption;
    }

    public setData(data: number[][]): void {
        this.chartOption.series[0].data = data;
    }
}
