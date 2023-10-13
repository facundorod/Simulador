import { Component, Input, OnInit } from '@angular/core';
import { PhysiologicalParameterEnum } from '@app/shared/enum/physiologicalParameterEnum';
import { PhysiologicalParameterSourceEnum } from '@app/shared/enum/physiologicalParameterSourceEnum';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';

@Component({
    selector: 'app-parameter-box-monitor',
    templateUrl: './parameter-box-monitor.component.html',
    styleUrls: ['./parameter-box-monitor.component.css']
})
export class ParameterBoxMonitorComponent implements OnInit {
    @Input() parameter: PhysiologicalParamaterI;
    @Input() heartRate: number;
    @Input() breathRate: number;
    @Input() diastolicPressure: number;
    @Input() systolicPressure: number;
    @Input() etCO2: number;
    @Input() inspirationCO2: number;
    @Input() meanPressure: number;
    @Input() oxygenSaturation: number;
    @Input() color: string;

    constructor() { }

    ngOnInit(): void {
    }

    public isECGParameter(): boolean {
        return this.parameter.label === PhysiologicalParameterEnum.HeartRate;
    }

    public isSourceCar(): boolean {
        return this.parameter.source === PhysiologicalParameterSourceEnum.Heart
            && this.parameter.label !== PhysiologicalParameterEnum.HeartRate;
    }

    public isSourceBreath(): boolean {
        return this.parameter.source === PhysiologicalParameterSourceEnum.Breath;
    }

    public isPletismographyParameter(): boolean {
        return this.parameter.label === PhysiologicalParameterEnum.OxygenSaturation;
    }

    public isIbpParameter(): boolean {
        return this.parameter.label === PhysiologicalParameterEnum.InvasiveBloodPressure;
    }

    public isCapnoParameter(): boolean {
        return this.parameter.label === PhysiologicalParameterEnum.Capnography;
    }

    public getLabel(): string {
        return this.parameter.label;
    }

    public getUnitValue(): string {
        return this.parameter.unit;
    }


    public getValue(): number {
        if (this.isECGParameter())
            return this.heartRate;
        return this.oxygenSaturation;
    }
}
