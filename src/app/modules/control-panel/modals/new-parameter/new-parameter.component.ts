import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhysiologicalParamaterI } from '@app/shared/models/physiologicalParamaterI';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ParametersService } from '../../services/parameters.service';

@Component({
    selector: 'app-new-parameter',
    templateUrl: './new-parameter.component.html',
    styleUrls: ['./new-parameter.component.css'],
})
export class NewParameterComponent implements OnInit {
    private formGroup: FormGroup;
    private parameter: PhysiologicalParamaterI;
    private parameters: PhysiologicalParamaterI[] = [];

    constructor(
        private fb: FormBuilder,
        private parameterSvc: ParametersService,
        private activeModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.loadData();
        this.initFormGroup();
    }

    private initFormGroup(): void {
        this.formGroup = this.fb.group({
            name: [
                this.parameter ? this.parameter.name : '',
                Validators.required,
            ],
            description: [
                this.parameter ? this.parameter.description : '',
                Validators.required,
            ],
            colorLine: [this.parameter ? this.parameter.colorLine : null],
            label: [
                this.parameter ? this.parameter.label : '',
                Validators.required,
            ],
            specialConfiguration: [
                this.parameter ? this.parameter.specialConfiguration : null,
            ],
            unit: [
                this.parameter ? this.parameter.unit : '',
                Validators.required,
            ],
            source: [
                this.parameter
                    ? this.parameter?.source
                        ? this.parameter.source
                        : 'noSource'
                    : null,
            ],
        });
    }

    public onSubmit(): void {
        if (this.formGroup.valid) {
            if (this.formGroup.get('source').value === 'noSource') {
                this.formGroup.value.source = null;
            }
            this.activeModal.close(this.formGroup.value);
        }
    }

    public getFormGroup(): FormGroup {
        return this.formGroup;
    }

    public getParameter(): PhysiologicalParamaterI {
        return this.parameter;
    }

    public onCancel(): void {
        this.activeModal.close();
    }

    public setParameter(param: PhysiologicalParamaterI) {
        this.parameter = param;
    }

    private loadData(): void {
        this.parameterSvc.findAll().subscribe(
            (value: PhysiologicalParamaterI[]) => {
                if (value) { this.parameters = value; }
            },
            (error: Error) => {
                console.error(error);
            }
        );
    }

    public getParameters(): PhysiologicalParamaterI[] {
        return this.parameters;
    }

    public compareParameters(
        p1: PhysiologicalParamaterI,
        p2: PhysiologicalParamaterI
    ): boolean {
        if (p1 && p2) { return p1.id_pp == p2.id_pp; }
        if (!p1 && !p2) { return true; }
        return false;
    }
}
