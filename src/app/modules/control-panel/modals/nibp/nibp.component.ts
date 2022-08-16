import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-nibp',
    templateUrl: './nibp.component.html',
    styleUrls: ['./nibp.component.css']
})
export class NibpComponent implements OnInit {
    private formGroup: FormGroup;
    private timeNibp: number;
    constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) { }

    ngOnInit(): void {
        this.initFormGroup();
    }

    private initFormGroup(): void {
        this.formGroup = this.fb.group({
            timeNibp: [this.timeNibp ? this.timeNibp : 5, Validators.required],
            startNow: [false]
        });
    }

    public onSubmit(): void {
        if (this.formGroup.valid) {
            this.activeModal.close(this.formGroup.value);
        }
    }

    public onCancel(): void {
        this.activeModal.close();
    }

    public setInitialValue(initialValue: number): void {
        this.timeNibp = initialValue;
    }

    public getFormGroup(): FormGroup {
        return this.formGroup;
    }
}
