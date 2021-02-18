import { ScenarioService } from "./../../services/scenario.service";
import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ScenariosModalComponent } from "@app/modules/simulation/modals/scenarios-modal/scenarios-modal.component";

@Component({
    selector: "app-scenarios",
    templateUrl: "./scenarios.component.html",
    styleUrls: ["./scenarios.component.css"],
})
export class ScenariosComponent extends BaseComponent implements OnInit {
    @Input() scenariosSelected: any[];
    protected scenarios: any;

    constructor(
        private scenariosService: ScenarioService,
        private modal: NgbModal
    ) {
        super();
    }

    ngOnInit(): void {}

    loadData() {}

    onLoadScenarios() {
        this.scenariosService.list().subscribe(
            (data: any) => {
                this.scenarios = data.data;
            },
            (error: any) => {
                console.log(error);
            }
        );

        const modal = this.modal.open(ScenariosModalComponent);
        modal.componentInstance.setScenarios(this.scenarios);
        modal.result.then(
            (data: any) => {},
            (error: any) => {
                console.log(error);
            }
        );
    }
}
