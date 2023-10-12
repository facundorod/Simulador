import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { curvesConfiguration } from '@app/shared/constants/curves';


@Component({
    selector: 'app-curves-preview',
    templateUrl: './curves-preview.component.html',
    styleUrls: ['./curves-preview.component.css']
})
export class CurvesPreviewComponent implements OnInit, AfterViewInit, OnChanges {
    private _dataset: [number, number][]
    @Input() set dataset(d: [number, number][]) {
        this._dataset = [...d];
    };
    @Input() colorLine: string;
    @Input() maxY: number;
    @Input() minY: number;
    @Input() samplingRate: number;
    @ViewChild('chartComponent') chartComponent: ChartComponent;

    private intervalCurves: NodeJS.Timeout;

    constructor() {
    }

    ngAfterViewInit(): void {
        this.simulationCurve();
    }

    ngOnInit(): void {
    }

    ngOnChanges(change: SimpleChanges): void {
        if (change.colorLine && !change.colorLine.firstChange) {
            this.chartComponent.updateColorLine(change.colorLine.currentValue)
        }

    }


    get dataset(): [number, number][] {
        return this._dataset;
    }

    private simulationCurve(): void {
        this.intervalCurves = setInterval(() => {
            if (this._dataset.length) {
                const currentIndex = this.chartComponent.getCurrentIndex();
                if (currentIndex % curvesConfiguration.TOTAL_POINTS === 0) {
                    this.dataset = [...this._dataset];
                }
            }
            if (this.chartComponent)
                this.chartComponent.updateRealTimeDataset();
        }, this.samplingRate)
    }

}
