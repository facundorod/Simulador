import { AnimalSpeciesI } from "./../../../../shared/models/animal-speciesI";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "@app/shared/components/base.component";
import { AnimalSpeciesService } from "../../services/animalSpecies.service";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: "app-animal-species",
    templateUrl: "./animal-species.component.html",
    styleUrls: ["./animal-species.component.css"],
})
export class AnimalSpeciesComponent extends BaseComponent implements OnInit {
    public animal: AnimalSpeciesI;
    public animalSpecies: AnimalSpeciesI[];
    public count: number ;
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
                    // q: this.formGroup.value.q,
                },
                this.order
            )
            .subscribe(
                (data: any) => {
                    debugger;
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

    //   saveAnimal(){

    //     this.toast.toastrConfig.timeOut = 1000;
    //     this.toast.toastrConfig.positionClass = "toast-bottom-full-width";
    //     this.abm.insertAnimalSpecies(this.animal).subscribe( () => {
    //        this.toast.success("The insert has been successful");

    //     })

    private initFormGroup() {
        this.formGroup = this.fb.group({
            q: [''],
            status: 'active'
        });
    }

    private loadURLParams() {
        this.formGroup.setValue(this.readFromRouteParams(this.route, this.formGroup.value));
        this.queryOptions = this.readFromRouteParams(this.route, this.queryOptions);
        this.order = this.readFromRouteParams(this.route, this.order);
    }

    public onPageChange() {
        this.loadData();
    }
}
