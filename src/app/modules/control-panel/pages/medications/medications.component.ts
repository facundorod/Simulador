import { MedicationI } from '@models/medicationI';
import { ConfirmModalComponent } from '../../../../shared/modals/confirm/confirm-modal.component';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base.component';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditComponentMed } from '../../modals/medications/modal-edit/modal-edit.component';
import { MedicationsService } from '../../services/medications.service';
import { AuthService } from '@app/services/auth.service';
@Component({
    selector: 'app-medications',
    templateUrl: './medications.component.html',
    styleUrls: ['./medications.component.css'],
})
export class MedicationsComponent extends BaseComponent implements OnInit {
    public medication: MedicationI;
    public medications: MedicationI[];

    public order = {
        orderBy: 'name',
        order: 'asc',
    };

    public paginatorData: {
        totalPages: number;
        itemsPerPage: number;
    };

    public queryOptions = {
        pageSize: 5,
        page: 1,
    };

    constructor(
        private fb: FormBuilder,
        private medicationsService: MedicationsService,
        private authService: AuthService,
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

        this.medicationsService
            .list(
                {
                    page: this.queryOptions.page,
                    pageSize: this.queryOptions.pageSize,
                    q: q ? q : this.formGroup.value.q,
                },
                this.order
            )
            .subscribe(
                (data: any) => {
                    this.setLoading(false);
                    if (data) {
                        this.medications = data.data;
                        this.paginatorData = {
                            totalPages: data.total,
                            itemsPerPage: data.per_page,
                        };
                    }
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

    public onPageChange() {
        this.loadData();
    }

    public onSearch() {
        this.queryOptions.page = 1;
        this.loadData();
    }

    public onEdit(index: number = null) {
        const modal = this.modal.open(ModalEditComponentMed);

        if (index !== null) {
            modal.componentInstance.setMedication(this.medications[index]);

            modal.result.then((result: MedicationI) => {
                if (result) {
                    this.medicationsService
                        .updateById(
                            this.medications[index].id_medication,
                            result
                        )
                        .subscribe(
                            () => {
                                this.toast.toastrConfig.timeOut = 1000;
                                this.toast.toastrConfig.positionClass =
                                    'toast-bottom-full-width';
                                this.toast.success(
                                    'The medication has been updated!'
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
            modal.result.then((result: MedicationI) => {
                if (result) {
                    this.medicationsService.create(result).subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                'toast-bottom-full-width';
                            this.toast.success(
                                'The medication has been inserted!'
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

    public onDelete(index: number) {
        const modal = this.modal.open(ConfirmModalComponent);

        modal.componentInstance.setTitle(
            `You will delete the medication ${this.medications[index].name}`
        );
        modal.componentInstance.setContent('Are you sure?');
        modal.result.then((result) => {
            if (result) {
                this.medicationsService
                    .delete(this.medications[index].id_medication)
                    .subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                'toast-bottom-full-width';
                            this.toast.success(
                                'The medication has been deleted!'
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

    public onClearSearch() {
        this.queryOptions.page = 1;
        this.initFormGroup();
        this.loadData();
    }

    public isUserAdmin(): boolean {
        return this.authService.isAdmin();
    }
}
