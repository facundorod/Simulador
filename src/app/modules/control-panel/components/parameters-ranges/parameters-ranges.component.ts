import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InputParameterI } from '@app/shared/models/inputParameters';

@Component({
    selector: 'app-parameters-ranges',
    templateUrl: './parameters-ranges.component.html',
    styleUrls: ['./parameters-ranges.component.css']
})
export class ParametersRangesComponent implements OnInit {
    private formGroup: FormGroup;
    @Input() parameters: InputParameterI;
    @Output() newHeartRate: EventEmitter<number>;
    @Output() newBreathRate: EventEmitter<number>;
    @Output() newSPO2: EventEmitter<number>;
    @Output() newTemp: EventEmitter<number>;

    @Input() connectedSimulation: boolean = false;


    constructor(private formBuilder: FormBuilder) {
        this.newHeartRate = new EventEmitter<number>();
        this.newBreathRate = new EventEmitter<number>();
        this.newSPO2 = new EventEmitter<number>();
        this.newTemp = new EventEmitter<number>();
    }

    ngOnInit(): void {
        this.initInputForm();
    }

    private initInputForm(): void {
        this.formGroup = this.formBuilder.group({
            heartRate: {
                value: this.parameters?.heartRate ? this.parameters.heartRate : 0,
                disabled: this.connectedSimulation,
            },
            respirationRate: {
                value: this.parameters?.breathRate ? this.parameters.breathRate : 0,
                disabled: this.connectedSimulation,
            },
            spo2: {
                value: this.parameters?.spO2 ? this.parameters.spO2 : 0,
                disabled: this.connectedSimulation,
            },
            temperature: {
                value: this.parameters?.temperature ? this.parameters.temperature : 0,
                disabled: this.connectedSimulation
            },
        })
        this.onValueChanges();
    }

    private onValueChanges(): void {
        this.formGroup.get('heartRate').valueChanges.subscribe((newHeartRate: number) => {
            if (!this.parameters || this.parameters.heartRate !== newHeartRate) {
                this.newHeartRate.emit(newHeartRate);
                this.parameters.heartRate = newHeartRate
            }
        })
        this.formGroup.get('respirationRate').valueChanges.subscribe((newBR: number) => {
            if (!this.parameters || this.parameters.breathRate !== newBR) {
                this.newBreathRate.emit(newBR);
                this.parameters.breathRate = newBR;
            }
        })
        this.formGroup.get('spo2').valueChanges.subscribe((newSPo2: number) => {
            if (!this.parameters || this.parameters.spO2 !== newSPo2) {
                this.newSPO2.emit(newSPo2);
                this.parameters.spO2 = newSPo2;
            }
        })

        this.formGroup.get('temperature').valueChanges.subscribe((newTemp: number) => {
            if (!this.parameters || this.parameters.spO2 !== newTemp) {
                this.newTemp.emit(newTemp);
                this.parameters.temperature = newTemp;
            }
        })

    }

    public getFormGroup(): FormGroup {
        return this.formGroup;
    }

    public getHeartRateValue(): number {
        return this.parameters?.heartRate || 0;
    }

    public setParametersInformation(newParameterValues: InputParameterI) {
        this.parameters = newParameterValues;
        this.formGroup.setValue({
            heartRate: newParameterValues.heartRate,
            respirationRate: newParameterValues.breathRate,
            spo2: newParameterValues.spO2,
            temperature: newParameterValues.temperature
        })
    }

}
