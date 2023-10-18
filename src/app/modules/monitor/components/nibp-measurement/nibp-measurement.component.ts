import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BloodPressureMeasurement, ParameterHelper } from '@app/modules/control-panel/helpers/parameterHelper';

@Component({
    selector: 'app-nibp-measurement',
    templateUrl: './nibp-measurement.component.html',
    styleUrls: ['./nibp-measurement.component.css']
})
export class NibpMeasurementComponent implements OnInit, OnDestroy, OnChanges {

    @Input() startNow: boolean = false;
    @Input() systolicIBP: number;
    @Input() diastolicIBP: number;
    @Input() timePeriod: number;
    @Input() meanIBP: number;
    public isMeasuringNIBP: boolean = false;
    public nibpValues: BloodPressureMeasurement;
    private nibpTimer: NodeJS.Timeout;
    constructor() {
        clearInterval(this.nibpTimer);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.startNow && !changes.startNow.firstChange)
            this.measureNIBP();
    }


    ngOnDestroy() {
        clearInterval(this.nibpTimer);
    }


    ngOnInit(): void {
        this.measureNIBP();
    }

    private measureNIBP(): void {
        clearInterval(this.nibpTimer);
        if (this.startNow) {
            this.calculateNIBP();
        }
        if (this.timePeriod) {
            this.nibpTimer = setInterval(() => {
                this.calculateNIBP();
            }, this.timePeriod * 60 * 1000)
        }


    }

    private calculateNIBP(): void {
        this.isMeasuringNIBP = true;
        setTimeout(() => {
            this.isMeasuringNIBP = false;
            this.nibpValues =
                ParameterHelper.calculateNIBP(this.systolicIBP, this.diastolicIBP, this.meanIBP);
        }, 13000)
    }

    public getSystolicNIBP(): number {
        return this.nibpValues.systolic;
    }


    public getDiastolicNIBP(): number {
        return this.nibpValues.diastolic;
    }

    public getMeanNIBP(): number {
        return this.nibpValues.mean;
    }

    public previousMeasurement(): boolean {
        if (this.nibpValues) return true;
        return false;
    }
}
