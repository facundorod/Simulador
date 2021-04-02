import { EChartsOption } from "echarts";

export class ChartConfigurer {
    protected chartOption: EChartsOption;
    protected chartDataSeries: number[][];
    protected colorLine: string;
    protected minX: number;
    protected maxX: number;
    protected minY: number;
    protected maxY: number;
    protected xAxisShow: boolean = true;

    constructor(
        series: number[][],
        colorLine: string = "blue",
        minX: number,
        maxX: number,
        minY: number,
        maxY: number,
        xAxisShow: boolean = true
    ) {
        this.loadData(series, colorLine, minX, maxX, minY, maxY, xAxisShow);
        this.chartOption = {
            xAxis: {
                type: "value",
                min: minX,
                max: maxX,
                show: this.xAxisShow ? this.xAxisShow : false,
                axisLine: {
                    show: this.xAxisShow ? this.xAxisShow : false,
                    onZero: this.xAxisShow ? this.xAxisShow : false,
                    lineStyle: {
                        width: 5,
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                splitLine: {
                    show: false,
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
        maxY: number,
        xAxisShow: boolean
    ): void {
        this.chartDataSeries = series;
        this.colorLine = colorLine;
        this.minX = minX;
        this.maxX = maxX;
        (this.minY = minY), (this.maxY = maxY);
        this.xAxisShow = xAxisShow;
    }

    public getChart(): EChartsOption {
        return this.chartOption;
    }

    public setData(data: number[][]): void {
        this.chartOption.series[0].data = data;
    }
}
