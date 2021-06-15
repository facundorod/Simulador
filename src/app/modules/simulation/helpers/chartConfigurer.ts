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
    protected lineStyle: Object;
    protected areaStyle: Object;
    constructor(
        series: number[][],
        colorLine: string = "blue",
        minX: number,
        maxX: number,
        minY: number,
        maxY: number,
        xAxisShow: boolean = true,
        type: string = null
    ) {
        this.loadData(
            series,
            type,
            colorLine,
            minX,
            maxX,
            minY,
            maxY,
            xAxisShow
        );
        this.chartOption = {
            xAxis: {
                type: "value",
                min: minX,
                max: maxX,
                show: this.xAxisShow ? this.xAxisShow : false,
                axisLine: {
                    // show: this.xAxisShow ? this.xAxisShow : false,
                    show: false,
                    onZero: this.minY == 0 ? true : false,
                    // lineStyle: {
                    //     width: 5,
                    // },
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
                min: minY,
                max: maxY,
                show: false,
            },
            series: [
                {
                    smooth: true,
                    showSymbol: false,
                    data: this.chartDataSeries,
                    emphasis: {
                        focus: "none",
                        scale: false,
                    },
                    type: "line",
                    color: this.colorLine,
                    lineStyle: this.lineStyle ? this.lineStyle :
                        { width: 2 },
                    areaStyle: this.areaStyle ? this.areaStyle : null,
                },
            ],
        };
    }

    public loadData(
        series: number[][],
        type: string = null,
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
        if (type === "etco2") {
            this.lineStyle = {
                width: 0,
            };
            this.areaStyle = {
                color: this.colorLine,
                origin: "start",
            };
        }
    }

    public getChart(): EChartsOption {
        return this.chartOption;
    }

    public setData(data: number[][]): void {
        this.chartOption.series[0].data = data;
    }
}
