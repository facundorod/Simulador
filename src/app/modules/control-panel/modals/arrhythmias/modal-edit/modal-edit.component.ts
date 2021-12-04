import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BaseComponent } from "@app/shared/components/base.component";
import { ArrhythmiaI } from "@app/shared/models/arrhythmiaI";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-modal-edit",
    templateUrl: "./modal-edit.component.html",
    styleUrls: ["./modal-edit.component.css"],
})
export class ModalEditComponentArr extends BaseComponent implements OnInit {
    public arr: ArrhythmiaI;

    constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {
        super();
    }

    ngOnInit() {
        this.initFormGroup();
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            name: [this.arr ? this.arr.name : "", Validators.required],
            description: [
                this.arr ? this.arr.description : "",
                Validators.required,
            ],
            extraInformation: [this.arr ? this.arr.extraInformation : null],
        });
    }

    public setArrhythmia(arr: ArrhythmiaI) {
        this.arr = arr;
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
