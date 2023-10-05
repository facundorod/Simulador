import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { curvesConfiguration } from '@app/shared/constants/curves';

@Component({
    selector: 'app-curves-preview',
    templateUrl: './curves-preview.component.html',
    styleUrls: ['./curves-preview.component.css']
})
export class CurvesPreviewComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() dataset: [number, number][];
    @Input() colorLine: string;
    @Input() maxY: number;
    @ViewChild('chartComponent') chartComponent: ChartComponent;
    private newDataset: [number, number][] = [];

    private intervalCurves: NodeJS.Timeout;

    constructor() {
    }

    ngAfterViewInit(): void {
        this.simulationHeartCurves();
    }

    ngOnInit(): void {
    }

    ngOnChanges(change: SimpleChanges): void {
        if (change.colorLine && !change.colorLine.firstChange) {
            this.chartComponent.updateColorLine(change.colorLine.currentValue)
        }
    }



    private simulationHeartCurves(): void {

        this.intervalCurves = setInterval(() => {
            if (this.newDataset.length) {
                const currentIndex = this.chartComponent.getCurrentIndex();
                if (currentIndex % curvesConfiguration.TOTAL_POINTS === 0) {
                    this.dataset = [...this.newDataset];
                    this.newDataset = [];
                }
            }
            if (this.chartComponent)
                this.chartComponent.updateRealTimeDataset();
        }, 50)
    }


    public updateDataset(newDataset: [number, number][]): void {
        this.newDataset = newDataset;
    }

}
