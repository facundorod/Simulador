import { ArrhythmiaI } from "./../../../../shared/models/arrhythmiaI";
import { ConfirmModalComponent } from "../../../../shared/modals/confirm/confirm-modal.component";
import { AnimalSpeciesI } from "../../../../shared/models/animal-speciesI";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "@app/shared/components/base.component";
import { FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalEditComponentArr } from "../../modals/arrhythmias/modal-edit/modal-edit.component";
import { ArrhythmiasService } from "../../services/arrhythmias.service";
import { AuthService } from "@app/services/auth.service";
@Component({
    selector: "app-arrhythmias",
    templateUrl: "./arrhythmias.component.html",
    styleUrls: ["./arrhythmias.component.css"],
})
export class ArrhythmiasComponent extends BaseComponent implements OnInit {
    public arrhythmia: ArrhythmiaI;
    public arrhythmias: ArrhythmiaI[];

    public order = {
        orderBy: "name",
        order: "asc",
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
        private arrhythmiasService: ArrhythmiasService,
        private authService: AuthService,
        private toast: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
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

        this.arrhythmiasService
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
                        this.arrhythmias = data.data;
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

    public onAddAnimalSpecie() { }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            q: [""],
        });
        this.formGroup.get("q").valueChanges.subscribe((newValue) => {
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
        const modal = this.modal.open(ModalEditComponentArr);

        if (index !== null) {
            modal.componentInstance.setArrhythmia(this.arrhythmias[index]);

            modal.result.then((result: ArrhythmiaI) => {
                if (result) {
                    this.arrhythmiasService
                        .updateById(this.arrhythmias[index].id_arr, result)
                        .subscribe(
                            () => {
                                this.toast.toastrConfig.timeOut = 1000;
                                this.toast.toastrConfig.positionClass =
                                    "toast-bottom-full-width";
                                this.toast.success(
                                    "The arrhythmia has been updated!"
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
            modal.result.then((result: ArrhythmiaI) => {
                if (result) {
                    this.arrhythmiasService.create(result).subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                "toast-bottom-full-width";
                            this.toast.success(
                                "The arrhythmia has been inserted!"
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
            `You will delete the arrhythmia ${this.arrhythmias[index].name}`
        );
        modal.componentInstance.setContent("Are you sure?");
        modal.result.then((result) => {
            if (result) {
                this.arrhythmiasService
                    .delete(this.arrhythmias[index].id_arr)
                    .subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                "toast-bottom-full-width";
                            this.toast.success(
                                "The arrhythmia has been deleted!"
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
