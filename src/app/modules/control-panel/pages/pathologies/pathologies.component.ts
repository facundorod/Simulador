import { PathologiesService } from "./../../services/pathologies.service";
import { PathologyI } from "@models/pathologyI";
import { ConfirmModalComponent } from "../../../../shared/modals/confirm/confirm-modal.component";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "@app/shared/components/base.component";
import { FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalEditComponentPath } from "../../modals/pathologies/modal-edit/modal-edit.component";
import { AuthService } from "@app/services/auth.service";
@Component({
    selector: "app-pathologies",
    templateUrl: "./pathologies.component.html",
    styleUrls: ["./pathologies.component.css"],
})
export class PathologiesComponent extends BaseComponent implements OnInit {
    public pathology: PathologyI;
    public pathologies: PathologyI[];
    public paginatorData: {
        totalPages: number;
        itemsPerPage: number;
    };

    public order = {
        orderBy: "name",
        order: "asc",
    };

    public queryOptions = {
        pageSize: 5,
        page: 1,
    };

    constructor(
        private fb: FormBuilder,
        private pathologiesService: PathologiesService,
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

        this.pathologiesService
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
                        this.pathologies = data.data;
                        this.paginatorData = {
                            totalPages: data.total,
                            itemsPerPage: data.per_page,
                        };
                    }
                },
                (err: Error) => {
                    this.setLoading(false);
                    console.error(err);
                }
            );
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            q: [""],
        });
        this.formGroup.get("q").valueChanges.subscribe((newValue) => {
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
        const modal = this.modal.open(ModalEditComponentPath);

        if (index !== null) {
            modal.componentInstance.setPathology(this.pathologies[index]);

            modal.result.then((result: PathologyI) => {
                if (result) {
                    this.pathologiesService
                        .updateById(this.pathologies[index].id_pat, result)
                        .subscribe(
                            () => {
                                this.toast.toastrConfig.timeOut = 1000;
                                this.toast.toastrConfig.positionClass =
                                    "toast-bottom-full-width";
                                this.toast.success(
                                    "The pathology has been updated!"
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
            modal.result.then((result: PathologyI) => {
                if (result) {
                    this.pathologiesService.create(result).subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                "toast-bottom-full-width";
                            this.toast.success(
                                "The pathology has been inserted!"
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
            `You will delete the pathology ${this.pathologies[index].name}`
        );
        modal.componentInstance.setContent("Are you sure?");
        modal.result.then((result) => {
            if (result) {
                this.pathologiesService
                    .delete(this.pathologies[index].id_pat)
                    .subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                "toast-bottom-full-width";
                            this.toast.success(
                                "The pathology has been deleted!"
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
