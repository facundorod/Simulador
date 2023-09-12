import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit {
    @Input() maxY: number;
    @Input() colorLine: string;
    private labels: string[] = [];
    @ViewChild('chart') chartElement: any;
    private chart: Chart;

    constructor() {
    }
    ngAfterViewInit(): void {
        this.initializeChart();
    }

    ngOnInit(): void {
    }


    private initializeChart(): void {
        const ctx = this.chartElement.nativeElement.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: [
                    {
                        data: [],
                        borderWidth: 3,
                        pointRadius: 0,
                        borderColor: this.colorLine,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                elements: {
                    line: {
                        tension: 0.005,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: this.maxY,
                        display: false,
                    },
                    x: {
                        type: "linear",
                        min: 0,
                        max: 12,
                        display: true,
                        grid: {
                            drawTicks: false,
                        }
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 0,
                },
                backgroundColor: '#000'
            }
        })

    }

    public updateChart(): void {
        if (this.chartElement) {
            return this.chart.update('resize');
        }
    }

    public addElementsToLabels(newElement: number): void {
        this.chart.data.labels.push(newElement);
        this.updateChart();
    }

    public addElementsToDataset(newElement: number): void {
        this.chart.data.datasets[0].data.push(newElement);
        this.updateChart();
    }
}
