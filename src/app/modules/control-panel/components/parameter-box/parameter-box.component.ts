import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { CurvesService } from '../../services/curves.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RefCurvesComponent } from '../../modals/ref-curves/ref-curves.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RefCurvesI } from '@app/shared/models/refCurvesI';
import { PhysiologicalParameterEnum } from '@app/shared/enum/physiologicalParameterEnum';
import { PhysiologicalParameterSourceEnum } from '@app/shared/enum/physiologicalParameterSourceEnum';
import { ParameterHelper } from '../../helpers/parameterHelper';

@Component({
    selector: 'app-parameter-box',
    templateUrl: './parameter-box.component.html',
    styleUrls: ['./parameter-box.component.css']
}) export class ParameterBoxComponent implements OnInit {

    private _parameter: PhysiologicalParamaterI; // Copia privada de parCurve
    @Output() newParameterDataset: EventEmitter<{
        curve: [number, number][], normalized: [number, number][]
    }> = new EventEmitter<{ curve: [number, number][], normalized: [number, number][] }>();
    @Output() ibpSystolic: EventEmitter<{ newibpSystolic: number, onlyUpdateValue: boolean }> = new EventEmitter<{ newibpSystolic: number, onlyUpdateValue: boolean }>();
    @Output() ibpDiastolic: EventEmitter<{ newibpDiastolic: number, onlyUpdateValue: boolean }> = new EventEmitter<{ newibpDiastolic: number, onlyUpdateValue: boolean }>();
    @Output() inspirationCO2: EventEmitter<{ newInspirationCO2: number, onlyUpdateValue: boolean }> = new EventEmitter<{ newInspirationCO2: number, onlyUpdateValue: boolean }>();
    @Output() endTidalCO2: EventEmitter<{ newEndTidalCO2: number, onlyUpdateValue: boolean }> = new EventEmitter<{ newEndTidalCO2: number, onlyUpdateValue: boolean }>();
    @Output() colorLine: EventEmitter<string> = new EventEmitter<string>();
    @Output() disconnectParameter: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() hideParameter: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() heartRate: number;
    @Input() breathRate: number;
    @Input() set parameter(param: PhysiologicalParamaterI) {
        // Crear una copia cuando se asigna el valor desde el padre
        this._parameter = { ...param };
    };

    private parameterForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        private modal: NgbModal,
        private curvesService: CurvesService
    ) { }

    ngOnInit(): void {
        this.initFormParameter();
    }



    get parameter(): PhysiologicalParamaterI {
        return this._parameter;
    }

    public getParameterName() {
        return this.parameter.name;
    }

    private initFormParameter(): void {
        this.parameterForm = this.formBuilder.group({
            disconnect: false,
            showInMonitor: true,
            colorLine: this._parameter ? this._parameter.colorLine : '',
            height: 0,
            ibpDiastolic: this._parameter.label === PhysiologicalParameterEnum.InvasiveBloodPressure ? ParameterHelper.getDiastolicPressure(this._parameter) : null,
            ibpSystolic: this._parameter.label === PhysiologicalParameterEnum.InvasiveBloodPressure ? ParameterHelper.getSystolicPressure(this._parameter) : null,
            etCO2: this._parameter.label === PhysiologicalParameterEnum.Capnography ? ParameterHelper.getEndTidalCO2(this._parameter) : null,
            inspirationCO2: this._parameter.label === PhysiologicalParameterEnum.Capnography ? ParameterHelper.getInspirationCO2(this._parameter) : null,
        })

        this.onValueChanges();
    }

    private onValueChanges(): void {
        this.parameterForm.get('colorLine').valueChanges.subscribe((newColorLine: string) => {
            if (newColorLine !== this._parameter.colorLine) {
                this.emitNewColorLine(newColorLine);
            }
        })
        this.parameterForm.get('disconnect').valueChanges.subscribe((disconnect: boolean) => {
            if (disconnect) {
                if (this.isCapnoParameter()) {
                    this.parameterForm.patchValue({ etCO2: 0, inspirationCO2: 0 })
                }
                if (this.isIBPParameter()) {
                    this.parameterForm.patchValue({ ibpDiastolic: 0, ibpSystolic: 0 })
                }
            } else {
                if (this.isCapnoParameter()) {
                    const inspirationCO2: number = ParameterHelper.getInspirationCO2(this._parameter)
                    const endTidalCO2: number = ParameterHelper.getEndTidalCO2(this._parameter)
                    this.parameterForm.patchValue({ etCO2: endTidalCO2, inspirationCO2 })
                }
                if (this.isIBPParameter()) {
                    const ibpDiastolic: number = ParameterHelper.getDiastolicPressure(this._parameter)
                    const ibpSystolic: number = ParameterHelper.getSystolicPressure(this._parameter)
                    this.parameterForm.patchValue({ ibpDiastolic, ibpSystolic })
                }
            }
            this.emitDisconnectParameter(disconnect);
        })
        this.parameterForm.get('showInMonitor').valueChanges.subscribe((hide: boolean) => {
            this.emitHideParameter(hide)
        })
        this.parameterForm.get('ibpDiastolic').valueChanges.subscribe((diastolicValue: number) => {
            if (!this.disconnectValue())
                if (diastolicValue !== ParameterHelper.getDiastolicPressure(this._parameter))
                    this.emitNewDiastolicValue(diastolicValue);
        })
        this.parameterForm.get('ibpSystolic').valueChanges.subscribe((systolicValue: number) => {
            if (!this.disconnectValue())
                if (systolicValue !== ParameterHelper.getSystolicPressure(this._parameter))
                    this.emitNewSystolicValue(systolicValue);
        })
        this.parameterForm.get('etCO2').valueChanges.subscribe((newETCO2: number) => {
            if (!this.disconnectValue())
                if (newETCO2 !== ParameterHelper.getEndTidalCO2(this._parameter))
                    this.emitNewEndTidalValue(newETCO2);
        })
        this.parameterForm.get('inspirationCO2').valueChanges.subscribe((newInspirationValue: number) => {
            if (!this.disconnectValue())
                if (newInspirationValue !== ParameterHelper.getInspirationCO2(this._parameter))
                    this.emitNewInspirationValue(newInspirationValue);
        })
    }

    public getCurrentCurve(): string {
        if (!this._parameter.runningCurve) {
            return ''
        }
        return this.parameter.runningCurve;
    }

    public disconnectValue(): boolean {
        return this.parameterForm.get('disconnect').value;
    }

    public getColorLine(): string {
        return this.parameterForm.get('colorLine').value;
    }

    public showInMonitor(): boolean {
        return this.parameterForm.get('showInMonitor').value;
    }

    public getFormGroup(): FormGroup {
        return this.parameterForm;
    }

    public onReplaceCurve(): void {
        const refModalCurves: NgbModalRef = this.modal.open(RefCurvesComponent, { size: 'lg', windowClass: 'modal-small' });
        refModalCurves.componentInstance.setRefCurves(this.parameter.refCurves);
        refModalCurves.result.then((value: RefCurvesI) => {
            if (value?.dataset && value.dataset.length) {
                const valueSource: number = ParameterHelper.isHeartSource(this._parameter) ? this.heartRate : this.breathRate;
                this._parameter.curve = this.curvesService.normalizeCurveDataset(value.dataset);
                this._parameter.normalizedCurve = this.curvesService.normalizeDataset(this._parameter.curve, valueSource, this.parameter.source);
                this.calculateNewPressure();
                this.emitNewParameterDataset();
                this._parameter.runningCurve = value.name;
                this.calculateNewCapnoValues();
            }
        })
    }


    public calculateNewPressure(): void {
        if (ParameterHelper.isIBPParameter(this._parameter)) {
            const newIbpDiastolic: number = ParameterHelper.getDiastolicPressure(this._parameter);
            const newIbpSystolic: number = ParameterHelper.getSystolicPressure(this._parameter);
            this.parameterForm.patchValue({ ibpDiastolic: newIbpDiastolic, ibpSystolic: newIbpSystolic })
            this.emitNewDiastolicValue(newIbpDiastolic, true)
            this.emitNewSystolicValue(newIbpSystolic, true);
        }
    }

    private calculateNewCapnoValues() {
        if (ParameterHelper.isCapnoParameter(this._parameter)) {
            const newInspirationValue: number = ParameterHelper.getInspirationCO2(this._parameter);
            const newEndTidalCO2: number = ParameterHelper.getEndTidalCO2(this._parameter);
            this.parameterForm.patchValue({ inspirationCO2: newInspirationValue, etCO2: newEndTidalCO2 });
            this.emitNewInspirationValue(newInspirationValue, true);
            this.emitNewEndTidalValue(newEndTidalCO2, true);
        }
    }



    private emitNewColorLine(newColorLine: string): void {
        this.colorLine.emit(newColorLine);
    }

    private emitNewParameterDataset(): void {
        this.newParameterDataset.emit({ curve: this._parameter.curve, normalized: this._parameter.normalizedCurve })
    }

    private emitDisconnectParameter(disconnectValue: boolean) {
        this.disconnectParameter.emit(disconnectValue);
    }

    private emitNewSystolicValue(newValue: number, onlyUpdateValue: boolean = false): void {
        this.ibpSystolic.emit({ newibpSystolic: newValue, onlyUpdateValue });
    }


    private emitNewDiastolicValue(newValue: number, onlyUpdateValue: boolean = false): void {
        this.ibpDiastolic.emit({ newibpDiastolic: newValue, onlyUpdateValue });
    }

    private emitNewInspirationValue(newValue: number, onlyUpdateValue: boolean = false): void {
        this.inspirationCO2.emit({ newInspirationCO2: newValue, onlyUpdateValue });
    }

    private emitNewEndTidalValue(newValue: number, onlyUpdateValue: boolean = false): void {
        this.endTidalCO2.emit({ newEndTidalCO2: newValue, onlyUpdateValue });
    }

    public isIBPParameter(): boolean {
        return ParameterHelper.isIBPParameter(this._parameter)
    }

    public isCapnoParameter(): boolean {
        return ParameterHelper.isCapnoParameter(this._parameter)
    }

    private emitHideParameter(hide: boolean) {
        this.hideParameter.emit(hide);
    }
}
