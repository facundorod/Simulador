import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { CurvesService } from '../../services/curves.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RefCurvesComponent } from '../../modals/ref-curves/ref-curves.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RefCurvesI } from '@app/shared/models/refCurvesI';
import { PhysiologicalParameterEnum } from '@app/shared/enum/physiologicalParameterEnum';
import { PhysiologicalParameterSourceEnum } from '@app/shared/enum/physiologicalParameterSourceEnum';

@Component({
    selector: 'app-parameter-box',
    templateUrl: './parameter-box.component.html',
    styleUrls: ['./parameter-box.component.css']
})
export class ParameterBoxComponent implements OnInit {
    private _parameter: PhysiologicalParamaterI; // Copia privada de parCurve
    @Output() newParameterDataset: EventEmitter<[number, number][]> = new EventEmitter<[number, number][]>();
    @Output() colorLine: EventEmitter<string> = new EventEmitter<string>();
    @Output() disconnectParameter: EventEmitter<boolean> = new EventEmitter<boolean>();
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
        this.parameterForm.get('disconnect').valueChanges.subscribe((disconnect: boolean) => {
            this.emitDisconnectParameter(disconnect);
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
                this._parameter.curve = value.dataset;
                this._parameter.normalizedCurve = this.curvesService
                    .normalizeDataset(value.dataset, this.parameter.source === PhysiologicalParameterSourceEnum.Heart ? this.heartRate : this.breathRate,
                        this.parameter.source)
                this.emitNewParameterDataset();
            }
        })
    }


    public emitNewColorLine(newColorLine: string): void {
        this.colorLine.emit(newColorLine);
    }

    public emitNewParameterDataset(): void {
        this.newParameterDataset.emit(this._parameter.curve)
    }

    public emitDisconnectParameter(disconnectValue: boolean) {
        this.disconnectParameter.emit(disconnectValue);
    }
}
