import { ChartOptionsI } from '@app/shared/models/chartOptionsI';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, ChartType } from 'ng-apexcharts';

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

export function commonOptions(toolbarEnabled: boolean, maxX: number, minX: number,
    maxY: number, minY: number, type?: ChartType): Partial<ChartOptions> {
    return {
        stroke: {
            curve: 'smooth',
            width: 1.8
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: 'numeric',
            labels: {
                show: false
            },
            axisTicks: {
                show: false
            },

            axisBorder: {
                show: false
            },
            max: maxX,
            min: minX,
        },
        chart: {
            id: "curves",
            type: type ? type : "line",
            height: 100,
            animations: {
                enabled: true,
                easing: "linear",
                dynamicAnimation: {
                    speed: 10
                }
            },
            zoom: {
                enabled: toolbarEnabled
            },
            toolbar: {
                show: toolbarEnabled
            }
        },
        fill: {
            type: "solid"
        },
        yaxis: {
            labels: {
                show: false
            },
            show: false,
            max: maxY,
            min: minY,
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            show: false
        },
        tooltip: {
            enabled: toolbarEnabled
        }
    }
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
                    color: this.chartOptions.colorLine
                }
            ],
            stroke: {
                curve: 'smooth',
                width: 1.8
            },
            markers: {
                size: 0
            },
            xaxis: {
                type: 'numeric',
                labels: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                max: this.chartOptions.maxX,
                min: this.chartOptions.minX,
                axisBorder: {
                    show: false
                }
            },
            chart: {
                id: "curves",
                height: this.chartOptions.height,
                type: type ? type : 'line',
                // animations: {
                //     enabled: true,
                //     easing: "linear",
                //     dynamicAnimation: {
                //         speed: 10
                //     }
                // },
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: this.chartOptions.toolbar
                }
            },
            yaxis: {
                labels: {
                    show: false
                },
                show: false,
                max: this.chartOptions.maxY,
                min: this.chartOptions.minY,
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            grid: {
                show: false
            },
            tooltip: {
                // enabled: true
                enabled: this.chartOptions.toolbar,
            }
        };
    }

    public getChart(): Partial<ChartOptions> {
        return this.apexChartOptions;
    }


}

