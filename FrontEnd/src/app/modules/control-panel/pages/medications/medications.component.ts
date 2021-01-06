import { MedicationI } from "@models/medicationI";
import { ConfirmModalComponent } from "../../../../shared/modals/confirm/confirm-modal.component";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "@app/shared/components/base.component";
import { FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnimalSpeciesEditComponent } from "../../modals/animal-specie-edit.component";
import { MedicationsService } from "../../services/medications.service";
@Component({
    selector: "app-medications",
    templateUrl: "./medications.component.html",
    styleUrls: ["./medications.component.css"],
})
export class MedicationsComponent extends BaseComponent implements OnInit {
    public medication: MedicationI;
    public medications: MedicationI[];
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
        private medicationsService: MedicationsService,
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

        this.medicationsService
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
                        this.medications = data.data;
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

    public onAddAnimalSpecie() {}

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
            modal.componentInstance.setAnimalSpecie(this.medications[index]);

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
                                    "toast-bottom-full-width";
                                this.toast.success(
                                    "The medication has been updated!"
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
                                "toast-bottom-full-width";
                            this.toast.success(
                                "The medication has been inserted!"
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
        modal.componentInstance.setContent("Are you sure?");
        modal.result.then((result) => {
            if (result) {
                this.medicationsService
                    .delete(this.medications[index].id_medication)
                    .subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                "toast-bottom-full-width";
                            this.toast.success(
                                "The medication has been deleted!"
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
