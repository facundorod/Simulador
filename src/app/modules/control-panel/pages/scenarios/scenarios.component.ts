import { ScenarioService } from "./../../services/scenario.service";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ScenariosModalComponent } from "@app/modules/simulation/modals/scenarios-modal/scenarios-modal.component";
import { ScenariosCreateComponent } from "../../modals/scenarios-create/scenarios-create.component";
import { MedicationsService } from "../../services/medications.service";
import { PathologiesService } from "../../services/pathologies.service";
import { ArrhythmiasService } from "../../services/arrhythmias.service";
import { SimulationService } from "@app/modules/simulation/services/simulation.service";
import { Router } from "@angular/router";
@Component({
    selector: "app-scenarios",
    templateUrl: "./scenarios.component.html",
    styleUrls: ["./scenarios.component.css"],
})
export class ScenariosComponent extends BaseComponent implements OnInit {
    @Input() scenariosSelected: any[];
    @Output() returnScenarios: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() posScenarios: EventEmitter<any> = new EventEmitter<any>();

    scenarios: any[];
    indexScenarioActive: number;
    indexScenarioEdit: number;
    arrhythmias: any[] = []; // Arrhythmias to populate the dropdown
    arrhythmiasScenario: any[] = []; // Arrhythmias from scenario
    pathologies: any[] = [];
    pathologiesScenario: any[] = []; // Pathologies from scenario
    medications: any[] = [];
    medicationsScenario: any[] = [];
    tempValue: number;
    cardiacCycleValue: number;
    repRateValue: number;
    scenariosSimulation: any[];
    activeScenario: any;
    simulationsNumber: number = 0;
    curves: any[] = [];

    private isScenariosPanelRoute: boolean = false;
    constructor(private modal: NgbModal, private router: Router) {
        super();

        this.indexScenarioActive = 0;
        this.indexScenarioEdit = 0;
        this.isScenariosPanelRoute =
            this.router.url === "/panel" ? true : false;
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {}

    onAddScenario(): void {
        const modal = this.modal.open(ScenariosCreateComponent);
        modal.result.then(
            (data: any) => {
                if (data) {
                    if (this.scenariosSelected.length > 0)
                        this.scenariosSelected =
                            this.scenariosSelected.concat(data);
                    else {
                        this.scenariosSelected = data;
                    }
                    if (this.isScenariosPanelRoute) {
                        this.posScenarios.emit({
                            indexEdit: this.indexScenarioEdit,
                            indexActive: this.indexScenarioActive,
                        });
                        this.returnScenarios.emit(this.scenariosSelected);
                    }
                }
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    /**
     * Load scenarios from db
     */
    onLoadScenarios(): void {
        const modal = this.modal.open(ScenariosModalComponent);

        modal.result.then(
            (data: any) => {
                if (data) {
                    if (this.scenariosSelected?.length > 0)
                        this.scenariosSelected =
                            this.scenariosSelected.concat(data);
                    else this.scenariosSelected = data;
                    if (this.isScenariosPanelRoute) {
                        this.returnScenarios.emit(this.scenariosSelected);
                    }
                }
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    isActiveScenario(index: number): boolean {
        return index === this.indexScenarioActive;
    }

    isScenarioEdit(index: number): boolean {
        return index === this.indexScenarioEdit;
    }

    /**
     * Activate scenario
     * @param index
     */
    onActiveScenario(index: number): void {
        this.indexScenarioActive = index;
        if (this.isScenariosPanelRoute) {
            this.posScenarios.emit({
                indexEdit: this.indexScenarioEdit,
                indexActive: this.indexScenarioActive,
            });
        }
        if (this.isScenariosPanelRoute) {
            this.returnScenarios.emit(this.scenariosSelected);
        }
    }

    /**
     * Delete scenario
     * @param index
     */
    onDelete(index: number): void {
        this.scenariosSelected.splice(index, 1);
        if (this.isScenariosPanelRoute) {
            this.posScenarios.emit({
                indexEdit: this.indexScenarioEdit,
                indexActive: this.indexScenarioActive,
            });
        }

        if (this.isScenariosPanelRoute) {
            this.returnScenarios.emit(this.scenariosSelected);
        }
    }
}
