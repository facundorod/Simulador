import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BaseComponent } from "@app/shared/components/base.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: "./simulations.component.html",
    styleUrls: ["./simulations.component.css"],
})
export class SimulationsComponent extends BaseComponent implements OnInit {
    public simulation: any;
    public simulations: any[];

    constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {
        super();
    }

    ngOnInit() {
        this.initFormGroup();
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            simulation: [
                this.simulation ? this.simulation : "",
                Validators.required,
            ],
        });
    }

    public setSimulations(simulations: any[]) {
        this.simulations = simulations;
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
