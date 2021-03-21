import { BaseComponent } from "@app/shared/components/base.component";
import { Component, OnInit } from "@angular/core";
import { ScenarioService } from "../../services/scenario.service";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: "./scenarios-create.component.html",
    styleUrls: ["./scenarios-create.component.css"],
})
export class ScenariosCreateComponent extends BaseComponent implements OnInit {
    constructor(
        private scenariosService: ScenarioService,
        private fb: FormBuilder,
        private activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit(): void {
        this.initFormGroup();
    }

    onAddScenario(): void {
        if (this.formGroup.valid) {
            this.scenariosService
                .create({
                    name: this.formGroup.value.name,
                    description: this.formGroup.value.description,
                })
                .subscribe(
                    (data: any) => {
                        this.activeModal.close(data);
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
        }
    }

    onCancel() {
        this.activeModal.close();
    }

    private initFormGroup(): void {
        this.formGroup = this.fb.group({
            name: ["", Validators.required],
            description: [""],
        });
    }
}
