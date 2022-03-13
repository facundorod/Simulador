import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base.component';
import { MedicationI } from '@app/shared/models/medicationI';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-edit',
    templateUrl: './modal-edit.component.html',
    styleUrls: ['./modal-edit.component.css'],
})
export class ModalEditComponentMed extends BaseComponent implements OnInit {
    public med: MedicationI;

    constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {
        super();
    }

    ngOnInit() {
        this.initFormGroup();
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            name: [this.med ? this.med.name : '', Validators.required],
            description: [
                this.med ? this.med.description : '',
                Validators.required,
            ],
            extraInformation: [
                this.med && this.med.extraInformation
                    ? this.med.extraInformation
                    : '',
            ],
        });
    }

    public setMedication(med: MedicationI) {
        this.med = med;
    }

    onSubmit() {
        this.setSubmitForm(true);
        if (this.formGroup.valid) {
            this.activeModal.close(this.formGroup.value);
        }
    }

    onCancel() {
        this.activeModal.close();
    }
}
