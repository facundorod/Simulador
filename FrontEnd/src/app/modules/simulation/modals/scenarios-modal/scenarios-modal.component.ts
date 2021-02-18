import { ScenarioI } from "@models/scenarioI";
import { ScenarioService } from "../../../control-panel/services/scenario.service";
import { AnimalSpeciesI } from "../../../../shared/models/animal-speciesI";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { BaseComponent } from "@app/shared/components/base.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: "./scenarios-modal.component.html",
    styleUrls: ["./scenarios-modal.component.css"],
})
export class ScenariosModalComponent extends BaseComponent implements OnInit {
    scenarios: any[];

    constructor(private activeModal: NgbActiveModal, private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.initFormGroup();
    }

    public setScenarios(scenarios: any[]) {
        this.scenarios = scenarios;
    }

    onCancel() {
        this.activeModal.close();
    }

    onSelect() {
        this.setSubmitForm(true);
        const scenarios: any[] = [];
        for (
            let i = 0;
            i < this.formGroup.value.scenarioSelected.length;
            i += 1
        ) {
            if (this.formGroup.value.scenarioSelected[i].value)
                scenarios.push(this.scenarios[i]);
        }
        this.activeModal.close(scenarios);
    }

    initFormGroup() {
        this.formGroup = this.fb.group({
            scenarioSelected: this.fb.array([]),
        });

        if (this.scenarios) {
            this.scenarios.forEach(() => {
                (<FormArray>this.formGroup.get("scenarioSelected")).push(
                    this.fb.group({
                        value: [false],
                    })
                );
            });
        }
    }

    public containsTrue(): boolean {
        return this.formGroup.value.scenarioSelected.some(
            (check: any) => check.value == true
        );
    }
}
