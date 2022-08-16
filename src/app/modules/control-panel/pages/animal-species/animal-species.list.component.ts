import { ConfirmModalComponent } from '../../../../shared/modals/confirm/confirm-modal.component';
import { AnimalSpeciesI } from '../../../../shared/models/animal-speciesI';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '@app/shared/components/base.component';
import { AnimalSpeciesService } from '../../services/animalSpecies.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditComponent } from '../../modals/animalSpecies/modal-edit/modal-edit.component';
import { AuthService } from '@app/services/auth.service';
@Component({
    selector: 'app-animal-species',
    templateUrl: './animal-species.list.component.html',
    styleUrls: ['./animal-species.list.component.css'],
})
export class AnimalSpeciesListComponent
    extends BaseComponent
    implements OnInit {
    public animal: AnimalSpeciesI;
    public animalSpecies: AnimalSpeciesI[];

    public paginatorData: {
        totalPages: number;
        itemsPerPage: number;
    };

    public order = {
        orderBy: 'name',
        order: 'asc',
    };

    public queryOptions = {
        pageSize: 5,
        page: 1,
    };

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private animalSpeciesService: AnimalSpeciesService,
        private toast: ToastrService,
        private modal: NgbModal
    ) {
        super();
    }

    ngOnInit(): void {
        this.initFormGroup();
        this.loadData();
    }

    private loadData(q: string = null) {
        this.setLoading(true);

        this.animalSpeciesService
            .list({
                page: this.queryOptions.page,
                pageSize: this.queryOptions.pageSize,
                q: q ? q : this.formGroup.value.q,
            })
            .subscribe(
                (data: any) => {
                    if (data) {
                        this.animalSpecies = data.data;
                        this.paginatorData = {
                            totalPages: data.total,
                            itemsPerPage: data.per_page,
                        };
                    }
                    this.setLoading(false);
                },
                (err: any) => {
                    this.setLoading(false);
                    console.error(err);
                }
            );
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            q: [''],
        });
        this.formGroup.get('q').valueChanges.subscribe((newValue) => {
            this.setLoading(true);
            this.loadData(newValue);
        });
    }

    public onPageChange(): void {
        this.setLoading(true);
        this.loadData();
    }

    public onSearch() {
        this.queryOptions.page = 1;
        this.setLoading(true);
        this.loadData();
    }

    public onEdit(index: number = null) {
        const modal = this.modal.open(ModalEditComponent, {size: 'lg', windowClass: 'modal-small'});
        if (index !== null) {
            modal.componentInstance.setAnimalSpecie(this.animalSpecies[index]);

            modal.result.then((result: AnimalSpeciesI) => {
                if (result) {
                    this.animalSpeciesService
                        .updateById(this.animalSpecies[index].id_as, result)
                        .subscribe(
                            () => {
                                this.toast.toastrConfig.timeOut = 1000;
                                this.toast.toastrConfig.positionClass =
                                    'toast-bottom-full-width';
                                this.toast.success(
                                    'The animal patient has been updated'
                                );
                                this.loadData();
                            },
                            (err: any) => {
                                console.error(err);
                            }
                        );
                }
            });
        } else {
            modal.result.then((result: AnimalSpeciesI) => {
                if (result) {
                    this.animalSpeciesService.create(result).subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                'toast-bottom-full-width';
                            this.toast.success(
                                'The animal patient has been inserted'
                            );
                            this.loadData();
                        },
                        (err: any) => {
                            console.error(err);
                        }
                    );
                }
            });
        }
    }

    public isUserAdmin(): boolean {
        return this.authService.isAdmin();
    }

    public onDelete(index: number) {
        const modal = this.modal.open(ConfirmModalComponent, {size: 'lg', windowClass: 'modal-small'});

        modal.componentInstance.setTitle(
            `You will delete the animal ${this.animalSpecies[index].name}`
        );
        modal.componentInstance.setContent('Are you sure?');
        modal.result.then((result) => {
            if (result) {
                this.animalSpeciesService
                    .delete(this.animalSpecies[index].id_as)
                    .subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                'toast-bottom-full-width';
                            this.toast.success('The animal has been deleted');
                            this.loadData();
                        },
                        (err: any) => {
                            console.error(err);
                        }
                    );
            }
        });
    }

    public onClearSearch() {
        this.queryOptions.page = 1;
        this.initFormGroup();
        this.loadData();
    }
}
