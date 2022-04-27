import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ScenarioService } from '../../services/scenario.service';
import { ConfirmModalComponent } from '../../../../shared/modals/confirm/confirm-modal.component';
import { ScenarioCloneComponent } from '../../modals/scenario-clone/scenario-clone.component';
import { ScenarioParamsI } from '@app/shared/models/scenarioParamsI';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-scenario-params',
    templateUrl: './scenario-params.component.html',
    styleUrls: ['./scenario-params.component.css'],
})
export class ScenarioParamsComponent implements OnInit {
    constructor(
        private scenarioService: ScenarioService,
        private fb: FormBuilder,
        private router: Router,
        private toast: ToastrService,
        private modal: NgbModal,
        private authService: AuthService
    ) { }
    public scenarios: any;
    private formGroup: FormGroup;

    public paginatorData: {
        totalPages: number;
        itemsPerPage: number;
    };

    private loading = true;
    public queryOptions = {
        pageSize: 5,
        page: 1,
    };

    private order = {
        orderBy: 'updatedAt',
        order: 'asc',
    };

    ngOnInit(): void {
        this.initFormGroup();
        this.loadData();
    }

    public loadData(q: string = null): void {
        this.scenarioService
            .listWithParams(
                {
                    page: this.queryOptions.page,
                    pageSize: this.queryOptions.pageSize,
                    q: q ? q : this.formGroup.get('q').value,
                },
                this.order
            )
            .subscribe(
                (scenarios) => {
                    if (scenarios.data) {
                        this.paginatorData = {
                            totalPages: scenarios.total,
                            itemsPerPage: scenarios.per_page,
                        };
                        this.scenarios = scenarios.data;
                    }
                    this.loading = false;
                },
                (error: Error) => {
                    this.loading = false;
                    console.error(error);
                }
            );
    }

    public isLoading(): boolean {
        return this.loading;
    }

    public onPageChange(): void {
        this.loading = true;
        this.loadData();
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            q: [''],
        });
        this.formGroup.get('q').valueChanges.subscribe((newValue) => {
            this.loading = true;
            this.loadData(newValue);
        });
    }

    public getFormGroup(): FormGroup {
        return this.formGroup;
    }

    public clearSearch(): void {
        this.formGroup.get('q').reset();
        this.loading = true;
        this.loadData();
    }

    public onAddScenario(): void {
        this.router.navigateByUrl('/panel/scenarios/create');
    }

    public onEdit(id: number): void {
        this.router.navigateByUrl(`/panel/scenarios/edit/${id}`);
    }

    public onClone(index: number): void {
        const clonedScenario: ScenarioParamsI = this.scenarios[index];
        delete clonedScenario.id_scenario;
        if (clonedScenario) {
            const modal = this.modal.open(ScenarioCloneComponent, {size: 'lg', windowClass: 'modal-small'});
            modal.componentInstance.setName(clonedScenario.name);
            modal.result.then((result: { name: string }) => {
                if (result) {
                    this.loading = true;
                    clonedScenario.name = result.name;
                    this.scenarioService.create(clonedScenario).subscribe(() => {
                        this.toast.toastrConfig.timeOut = 1000;
                        this.toast.toastrConfig.positionClass =
                            'toast-bottom-full-width';
                        this.toast.success('Scenario cloned successfully');
                        this.loading = false;
                        this.loadData();
                    });
                }
            }, (error: Error) => {
                console.error(error);
            });
        }
    }

    public onDelete(id: number, index: number): void {
        const modal = this.modal.open(ConfirmModalComponent, {size: 'lg', windowClass: 'modal-small'});
        modal.componentInstance.setTitle(
            `You will delete the scenario ${this.scenarios[index].name}`
        );
        modal.componentInstance.setContent('Are you sure?');
        modal.result.then((result) => {
            if (result) {
                this.loading = true;
                this.scenarioService.delete(id).subscribe(
                    () => {
                        this.toast.toastrConfig.timeOut = 1000;
                        this.toast.toastrConfig.positionClass =
                            'toast-bottom-full-width';
                        this.toast.success('Scenario deleted successfully');
                        this.loading = true;
                        this.loadData();
                    },
                    (error: Error) => {
                        console.error(error);
                    }
                );
            }
        });
    }

    public isUserAdmin(): boolean {
        return this.authService.isAdmin();
    }
}
