import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base.component';
import { PathologyI } from '@app/shared/models/pathologyI';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-edit',
    templateUrl: './modal-edit.component.html',
    styleUrls: ['./modal-edit.component.css'],
})
export class ModalEditComponentPath extends BaseComponent implements OnInit {
    public path: PathologyI;

    constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {
        super();
    }

    ngOnInit() {
        this.initFormGroup();
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            name: [this.path ? this.path.name : '', Validators.required],
            description: [
                this.path ? this.path.description : '',
                Validators.required,
            ],
            extraInformation: [this.path ? this.path.extraInformation : null],
        });
    }

    public setPathology(path: PathologyI) {
        this.path = path;
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
