import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-scenario-clone',
    templateUrl: './scenario-clone.component.html',
    styleUrls: ['./scenario-clone.component.css']
})
export class ScenarioCloneComponent implements OnInit {
    public newName: string;
    public formGroup: FormGroup;
    constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) { }

    ngOnInit(): void {
        this.initFormGroup();
    }

    public setName(name: string) {
        if (name) { this.newName = name; }
    }

    public onCancel(): void {
        this.activeModal.close();
    }

    public onSubmit(): void {
        if (this.formGroup.valid) {
            this.activeModal.close(this.formGroup.value);
        }
    }

    private initFormGroup(): void {
        this.formGroup = this.fb.group({
            name: [this.newName ? this.newName : '', Validators.required]
        });
    }

}
