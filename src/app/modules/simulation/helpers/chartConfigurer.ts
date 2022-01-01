import { ChartOptionsI } from "@app/shared/models/chartOptionsI";
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexFill,
    ApexGrid,
    ApexLegend,
    ApexMarkers,
    ApexStroke,
    ApexTooltip,
    ApexXAxis,
    ApexYAxis,
    ChartComponent,
    ChartType,
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    stroke: ApexStroke;
    markers: ApexMarkers;
    legend: ApexLegend;
    tooltip: ApexTooltip;
    fill?: ApexFill;
};

export function commonOptions(
    toolbarEnabled: boolean,
    maxX: number,
    minX: number,
    maxY: number,
    minY: number,
    type?: ChartType
): Partial<ChartOptions> {
    return {
        stroke: {
            curve: "smooth",
            width: 2,
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: "numeric",
            labels: {
                show: false,
            },
            axisTicks: {
                show: false,
            },

            axisBorder: {
                show: true,
            },
            max: maxX,
            min: minX,
        },
        chart: {
            id: "curves",
            type: type ? type : "line",
            height: toolbarEnabled ? 130 : 143,
            redrawOnParentResize: true,
            redrawOnWindowResize: true,
            zoom: {
                enabled: toolbarEnabled,
            },
            toolbar: {
                show: toolbarEnabled,
            },
        },
        fill: {
            type: "solid",
        },
        yaxis: {
            labels: {
                show: toolbarEnabled,
            },
            show: toolbarEnabled,
            max: maxY,
            min: 0,
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            show: false,
        },
        tooltip: {
            enabled: toolbarEnabled,
        },
    };
}

export class ChartConfigurer {
    private apexChartOptions: Partial<ChartOptions>;
    private chartOptions: ChartOptionsI;

    constructor(chartOptions: ChartOptionsI) {
        this.chartOptions = chartOptions;
    }

    public setChart(dataset: [number, number][], type?: ChartType): void {
        this.apexChartOptions = {
            series: [
                {
                    data: dataset,
                    color: this.chartOptions.colorLine,
                },
            ],
            stroke: {
                curve: "smooth",
                width: 2,
            },
            markers: {
                size: 0,
            },
            xaxis: {
                type: "numeric",
                labels: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                max: this.chartOptions.maxX,
                min: this.chartOptions.minX,
                axisBorder: {
                    show: true,
                },
            },
            chart: {
                id: "curves",
                animations: {
                    enabled: true,
                    easing: "linear",
                    animateGradually: {
                        enabled: true,
                    },
                    dynamicAnimation: {
                        enabled: true,
                    },
                },
                redrawOnParentResize: true,
                redrawOnWindowResize: true,
                height: this.chartOptions.height,
                type: type ? type : "line",
                zoom: {
                    enabled: false,
                },
                width: "100%",
                toolbar: {
                    show: this.chartOptions.toolbar,
                },
            },
            fill: {
                type: "solid",
            },
            yaxis: {
                labels: {
                    show: false,
                },
                show: false,
                max: this.chartOptions.maxY,
                min: 0,
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
            },
            tooltip: {
                enabled: this.chartOptions.toolbar,
            },
        };
    }

    public getChart(): Partial<ChartOptions> {
        return this.apexChartOptions;
    }
}
