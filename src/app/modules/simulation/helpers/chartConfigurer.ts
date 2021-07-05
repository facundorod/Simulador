import { ViewChild } from '@angular/core';
import { ChartOptionsI } from '@app/shared/models/chartOptionsI';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexMarkers, ApexStroke, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';

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
};


export class ChartConfigurer {
    private apexChartOptions: Partial<ChartOptions>;
    private chartOptions: ChartOptionsI;
    constructor(chartOptions: ChartOptionsI) {
        this.chartOptions = chartOptions;
    }

    public setChart(dataset: [number, number][]): void {
        this.apexChartOptions = {
            series: [
                {
                    data: dataset,
                    color: this.chartOptions.colorLine
                }
            ],
            stroke: {
                curve: 'smooth',
                width: 2
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
                type: "line",
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
                show: false
            },
            grid: {
                show: false
            },
            tooltip: {
                enabled: this.chartOptions.toolbar
            }
        };
    }

    public getChart(): Partial<ChartOptions> {
        return this.apexChartOptions;
    }
}

