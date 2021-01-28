import { ConfirmModalComponent } from "../../../../shared/modals/confirm/confirm-modal.component";
import { AnimalSpeciesI } from "../../../../shared/models/animal-speciesI";
import { Component, OnInit } from "@angular/core";
import { Toast, ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "@app/shared/components/base.component";
import { AnimalSpeciesService } from "../../services/animalSpecies.service";
import { FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnimalSpeciesEditComponent } from "../../modals/animal-specie-edit/animal-specie-edit.component";
@Component({
    selector: "app-animal-species",
    templateUrl: "./animal-species.list.component.html",
    styleUrls: ["./animal-species.list.component.scss"],
})
export class AnimalSpeciesListComponent
    extends BaseComponent
    implements OnInit {
    public animal: AnimalSpeciesI;
    public animalSpecies: any;
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
        private animalSpeciesService: AnimalSpeciesService,
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

        this.animalSpeciesService
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
                        console.log(data);
                        this.animalSpecies = data.data;
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
            modal.componentInstance.setAnimalSpecie(this.animalSpecies[index]);

            modal.result.then((result: AnimalSpeciesI) => {
                if (result) {
                    this.animalSpeciesService
                        .updateById(this.animalSpecies[index].id_as, result)
                        .subscribe(
                            () => {
                                this.toast.toastrConfig.timeOut = 1000;
                                this.toast.toastrConfig.positionClass =
                                    "toast-bottom-full-width";
                                this.toast.success(
                                    "The animal specie has been updated"
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
                                "toast-bottom-full-width";
                            this.toast.success(
                                "The animal specie has been inserted"
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
            `You will delete the animal ${this.animalSpecies[index].name}`
        );
        modal.componentInstance.setContent("Are you sure?");
        modal.result.then((result) => {
            if (result) {
                this.animalSpeciesService
                    .delete(this.animalSpecies[index].id_as)
                    .subscribe(
                        () => {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                "toast-bottom-full-width";
                            this.toast.success(
                                "The animal specie has been deleted"
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
