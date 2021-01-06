import { PathologiesService } from './../../services/pathologies.service';
import { PathologyI } from "@models/PathologyI";
import { ConfirmModalComponent } from "../../../../shared/modals/confirm/confirm-modal.component";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "@app/shared/components/base.component";
import { FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnimalSpeciesEditComponent } from "../../modals/animal-specie-edit.component";
@Component({
    selector: "app-pathologies",
    templateUrl: "./pathologies.component.html",
    styleUrls: ["./pathologies.component.css"],
})
export class PathologiesComponent extends BaseComponent implements OnInit {
    public pathology: PathologyI;
    public pathologies: PathologyI[];
    public count: number;
    public page: number;
    public totalPages: number;

    public order = {
        orderBy: "name",
        order: "asc",
    };

    public queryOptions = {
        pageSize: 15,
        page: 1,
    };

    constructor(
        private fb: FormBuilder,
        private pathologiesService: PathologiesService,
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
        this.loadURLParams();
    }

    private loadData() {
        this.updateRouteParams(this.router, {
            ...this.queryOptions,
            ...this.formGroup.value,
            ...this.order,
        });

        this.setLoading(true);

        this.pathologiesService
            .list(
                {
                    page: this.queryOptions.page,
                    pageSize: this.queryOptions.pageSize,
                    q: this.formGroup.value.q,
                    name: this.formGroup.value.name,
                    description: this.formGroup.value.description,
                },
                this.order
            )
            .subscribe(
                (data: any) => {
                    this.setLoading(false);
                    if (data) {
                        this.pathologies = data.data;
                        this.count = data.total;
                        this.page = data.currentPage;
                        this.totalPages = data.to;
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
            q: [""],
            name: [""],
            description: [""],
        });
    }

    private loadURLParams() {
        this.formGroup.setValue(
            this.readFromRouteParams(this.route, this.formGroup.value)
        );
        this.queryOptions = this.readFromRouteParams(
            this.route,
            this.queryOptions
        );
        this.order = this.readFromRouteParams(this.route, this.order);
    }

    public onPageChange() {
        this.loadData();
    }

    public onSearch() {
        this.queryOptions.page = 1;
        this.loadData();
    }

    public onEdit(index: number = null) {
        const modal = this.modal.open(AnimalSpeciesEditComponent);

        if (index !== null) {
            modal.componentInstance.setAnimalSpecie(this.pathologies[index]);

            modal.result.then((result: PathologyI) => {
                if (result) {
                    this.pathologiesService
                        .updateById(
                            this.pathologies[index].id_pat,
                            result
                        )
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
}
