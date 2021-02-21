import { ScenarioService } from "./../../services/scenario.service";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ScenariosModalComponent } from "@app/modules/simulation/modals/scenarios-modal/scenarios-modal.component";
import { ArrayJsonPipe } from "../../../../shared/pipes/array-json.pipe";
import { ScenariosCreateComponent } from "../../modals/scenarios-create/scenarios-create.component";
@Component({
    selector: "app-scenarios",
    templateUrl: "./scenarios.component.html",
    styleUrls: ["./scenarios.component.css"],
})
export class ScenariosComponent extends BaseComponent implements OnInit {
    @Input() scenariosSelected: any[];
    @Output() returnScenarios: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() posScenarios: EventEmitter<any> = new EventEmitter<any>();

    protected scenarios: any[];
    protected indexScenarioActive: number;
    protected indexScenarioEdit: number;

    constructor(
        private scenariosService: ScenarioService,
        private modal: NgbModal
    ) {
        super();
        this.indexScenarioActive = 0;
        this.indexScenarioEdit = 0;
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.scenariosService.list().subscribe(
            (data: any) => {
                this.scenarios = data.data;
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    onAddScenario(): void {
        const modal = this.modal.open(ScenariosCreateComponent);
        modal.result.then(
            (data: any) => {
                if (data) {
                    if (this.scenariosSelected.length > 0)
                        this.scenariosSelected = this.scenariosSelected.concat(
                            data
                        );
                    else this.scenariosSelected = data;
                    this.returnScenarios.emit(this.scenariosSelected);
                }
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    onLoadScenarios(): void {
        const modal = this.modal.open(ScenariosModalComponent);
        modal.componentInstance.setScenarios(this.scenarios);
        modal.result.then(
            (data: any) => {
                if (data) {
                    if (this.scenariosSelected.length > 0)
                        this.scenariosSelected = this.scenariosSelected.concat(
                            data
                        );
                    else this.scenariosSelected = data;
                    this.returnScenarios.emit(this.scenariosSelected);
                }
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    onSaveScenario() {}

    isActiveScenario(index: number): boolean {
        return index === this.indexScenarioActive;
    }

    isScenarioEdit(index: number): boolean {
        return index === this.indexScenarioEdit;
    }

    onActiveScenario(index: number): void {
        this.indexScenarioActive = index;
        this.posScenarios.emit({
            indexEdit: this.indexScenarioEdit,
            indexActive: this.indexScenarioActive,
        });
        this.returnScenarios.emit(this.scenariosSelected);
    }

    onEditScenario(index: number): void {
        this.indexScenarioEdit = index;
        this.posScenarios.emit({
            indexEdit: this.indexScenarioEdit,
            indexActive: this.indexScenarioActive,
        });
        this.returnScenarios.emit(this.scenariosSelected);
    }

    onDelete(index: number): void {
        this.scenariosSelected.splice(index, 1);
        this.posScenarios.emit({
            indexEdit: this.indexScenarioEdit,
            indexActive: this.indexScenarioActive,
        });
        this.returnScenarios.emit(this.scenariosSelected);
    }
}
