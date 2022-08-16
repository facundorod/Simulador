import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './simulations.component.html',
    styleUrls: ['./simulations.component.css'],
})
export class SimulationsComponent extends BaseComponent implements OnInit {
    public simulations: any[];

    constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {
        super();
    }

    ngOnInit() {
        this.initFormGroup();
    }

    initFormGroup() {
        this.formGroup = this.fb.group({});
    }

    public setSimulations(simulations: any[]) {
        this.simulations = simulations;
    }

    onSubmit(index: number) {
        this.setSubmitForm(true);
        this.activeModal.close(this.simulations[index]);
    }

    onCancel() {
        this.activeModal.close();
    }
}
