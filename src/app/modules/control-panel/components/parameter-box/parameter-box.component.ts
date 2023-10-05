import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { CurvesService } from '../../services/curves.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RefCurvesComponent } from '../../modals/ref-curves/ref-curves.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RefCurvesI } from '@app/shared/models/refCurvesI';
import { PhysiologicalParameterEnum } from '@app/shared/enum/physiologicalParameterEnum';

@Component({
    selector: 'app-parameter-box',
    templateUrl: './parameter-box.component.html',
    styleUrls: ['./parameter-box.component.css']
})
export class ParameterBoxComponent implements OnInit {
    private _parameter: PhysiologicalParamaterI; // Copia privada de parCurve
    @Output() newParameter: EventEmitter<[number, number][]> = new EventEmitter<[number, number][]>();
    @Output() colorLine: EventEmitter<string> = new EventEmitter<string>();
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
            colorLine: this.parameter ? this.parameter.colorLine : '',
            height: 0
        })

        this.onValueChanges();
    }

    private onValueChanges(): void {
        this.parameterForm.get('colorLine').valueChanges.subscribe((newColorLine: string) => {
            if (newColorLine !== this._parameter.colorLine) {
                this.emitNewColorLine(newColorLine);
            }
        })
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
                const originalNormalizedCurve: [number, number][] = this.parameter.source === PhysiologicalParameterEnum.HeartSource ?
                    this.curvesService.normalizeDataset(value.dataset, this.heartRate, PhysiologicalParameterEnum.HeartSource) :
                    this.curvesService.normalizeDataset(value.dataset, this.breathRate, PhysiologicalParameterEnum.BreathSource)
                this._parameter.curve = this.curvesService.extendCurves(originalNormalizedCurve);
                this.emitNewParameterDataset();
            }
        })
    }


    public emitNewColorLine(newColorLine: string): void {
        this.colorLine.emit(newColorLine);
    }

    public emitNewParameterDataset(): void {
        this.newParameter.emit(this._parameter.curve)
    }
}
