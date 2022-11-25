import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScenariosModalComponent } from '@app/modules/simulation/modals/scenarios-modal/scenarios-modal.component';

import { Router } from '@angular/router';
import { AnimalSpeciesI } from '@app/shared/models/animal-speciesI';
@Component({
    selector: 'app-scenarios',
    templateUrl: './scenarios.component.html',
    styleUrls: ['./scenarios.component.css'],
})
export class ScenariosComponent extends BaseComponent implements OnInit {
    @Input() scenariosSelected: any[];
    @Output() returnScenarios: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() posScenarios: EventEmitter<any> = new EventEmitter<any>();
    @Input() animal: AnimalSpeciesI = null;
    public indexScenarioActive: number;
    public indexScenarioEdit: number;

    private isScenariosPanelRoute = false;
    constructor(private modal: NgbModal, private router: Router) {
        super();

        this.indexScenarioActive = 0;
        this.indexScenarioEdit = 0;
        this.isScenariosPanelRoute =
            this.router.url === '/panel' ? true : false;
    }

    ngOnInit(): void { }

    /**
     * Load scenarios from db
     */
    onLoadScenarios(): void {
        const modal = this.modal.open(ScenariosModalComponent, { size: 'lg', windowClass: 'modal-small'});
        modal.componentInstance.setAnimal(this.animal.id_as);
        modal.result.then(
            (data: any) => {
                if (data) {
                    if (this.scenariosSelected?.length > 0) {
                        this.scenariosSelected =
                            this.scenariosSelected.concat(data);
                    }
                    else { this.scenariosSelected = data; }
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

    public clearScenarios(): void {
        this.scenariosSelected = [];
    }

    public setAnimal(animal: AnimalSpeciesI): void {
        this.animal = animal;
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
        // if (this.isScenariosPanelRoute) {
        //     this.returnScenarios.emit(this.scenariosSelected);
        // }
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
