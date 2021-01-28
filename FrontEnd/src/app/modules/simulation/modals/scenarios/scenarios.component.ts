import { ScenarioI } from "@models/scenarioI";
import { ScenarioService } from "../../../control-panel/services/scenario.service";
import { AnimalSpeciesI } from "../../../../shared/models/animal-speciesI";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BaseComponent } from "@app/shared/components/base.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: "./scenarios.component.html",
    styleUrls: ["./scenarios.component.css"],
})
export class ScenariosComponent extends BaseComponent implements OnInit {
    scenarios: any[];

    constructor(private activeModal: NgbActiveModal) {
        super();
    }

    ngOnInit() {}

    public setScenarios(scenarios: any[]) {
        this.scenarios = scenarios;
    }

    onCancel() {
        this.activeModal.close();
    }

    onSelect(index: number) {
        this.setSubmitForm(true);
        this.activeModal.close(this.scenarios[index]);
    }
}
