import { ScenarioI } from "@models/scenarioI";
import { ScenarioService } from "./../../services/scenario.service";
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
    private order = {
        order: "desc",
        orderBy: "name",
    };
    constructor(
        private scenarioService: ScenarioService,
        private activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.scenarioService.list(null, this.order).subscribe(
            (scenarios) => {
                this.scenarios = scenarios.data;
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    onSubmit(index: number) {
        this.setSubmitForm(true);
        this.activeModal.close(this.scenarios[index]);
    }

    onCancel() {
        this.activeModal.close();
    }

    onDelete(index: number) {
        this.scenarios.splice(index, 1);
    }
}
