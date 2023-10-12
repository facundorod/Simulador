import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartOptions } from '@app/modules/simulation/helpers/chartConfigurer';
import { curvesConfiguration } from '@app/shared/constants/curves';
import * as NgApexCharts from 'ng-apexcharts';
@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() maxY: number;
    @Input() minY: number;
    @Input() height: string;
    @Input() colorLine: string;
    @Input() dataset: [number, number][]
    private currentIndex: number = 0;
    private activeDataset: [number, number][] = [];
    private sweepDataset: [number, number][] = [];

    @ViewChild('chart') chartElement: NgApexCharts.ChartComponent;
    private chartConfigured: boolean = false;
    private options: Partial<ChartOptions>;
    private sweepCurve: boolean = false;

    constructor() {
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes.colorLine && !changes.colorLine.firstChange) {
            this.updateColorLine(changes.colorLine.currentValue)
        }
    }


    ngAfterViewInit(): void {
    }



    ngOnInit(): void {
        this.initializeApexChart();
        this.chartConfigured = true;
    }

    public getChart(): Partial<ChartOptions> {
        return this.options;
    }

    private initializeApexChart(): void {
        this.activeDataset = [];
        this.options = this.getChartOptions();
    }



    public isChartConfigured(): boolean {
        return this.chartConfigured;
    }


    public updateDataset(newDataset: [number, number][]): void {
        this.dataset = newDataset;
    }

    public updateRealTimeDataset(): void {
        // Si se llego al final del monitor, es necesario actualizar los datasets
        if (this.currentIndex >= this.dataset.length - 1) {
            this.currentIndex = 0;
            this.sweepCurve = true;
        }

        const newSeries: [number, number] = [this.dataset[this.currentIndex][0], this.dataset[this.currentIndex][1]];

        if (this.shouldSwapCurves()) {
            this.swapDatasets();
        }

        if (this.sweepCurve) {
            this.activeDataset.shift();
            this.sweepDataset.push(newSeries);
        } else {
            this.activeDataset.push(newSeries)
        }
        this.updateSeries();
        this.currentIndex++;
    }

    public getCurrentIndex(): number {
        return this.currentIndex;
    }

    private swapDatasets(): void {
        const swapCurve = [...this.activeDataset];
        this.activeDataset = [...this.sweepDataset];
        this.sweepDataset = swapCurve;
    }

    private updateSeries(): void {
        if (this.chartElement) {
            this.chartElement.updateSeries([{ data: this.activeDataset }, { data: this.sweepDataset }], false)
        }
    }

    private shouldSwapCurves(): boolean {
        return this.sweepDataset.length === this.dataset.length - 1
    }

    public updateColorLine(newColorLine: string) {
        this.options.series.forEach((value) => {
            value.color = newColorLine
        })
        this.chartElement.updateOptions(this.options)
    }

    private getChartOptions(): Partial<ChartOptions> {
        return {
            series: [
                {
                    data: this.activeDataset,
                    color: this.colorLine
                },
                {
                    data: this.sweepDataset,
                    color: this.colorLine,
                }
            ],
            stroke: {
                curve: 'smooth',
                width: 3
            },
            xaxis: {
                type: 'numeric',
                labels: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                max: curvesConfiguration.MAX_MONITOR,
                min: 0,
            },
            chart: {
                id: 'chart',
                type: 'line',
                width: '100%',
                height: this.height,
                animations: {
                    enabled: false,
                },
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            yaxis: {
                labels: {
                    show: false,
                },
                show: false,
                max: this.maxY,
                min: this.minY
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
                enabled: false
            },
        }
    }

}
