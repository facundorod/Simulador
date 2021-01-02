import { AnimalSpeciesI } from "@models/animal-speciesI";
import { AnimalSpeciesService } from "./../../../services/animalSpecies.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base.component";
import { NgbTimepickerConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: "./animal-species.edit.component.html",
    styleUrls: ["./animal-species.edit.component.css"],
})
export class AnimalSpeciesEditComponent
    extends BaseComponent
    implements OnInit {
    public mode = null;
    public animalSpecieId: number;
    public animalSpecie: AnimalSpeciesI;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private config: NgbTimepickerConfig,
        private router: Router,
        private animalSpecieService: AnimalSpeciesService
    ) {
        super();
        this.config.seconds = true;
        this.config.spinners = false;
    }

    ngOnInit() {
        this.initFormGroup();

        this.mode = this.route.snapshot.data["mode"];
        if (this.mode === "edit") {
            this.route.params.subscribe((params) => {
                this.animalSpecieId = params["animalSpecieId"];
                this.loadData();
            });
        }
    }

    public loadData() {
        this.setLoading(true);

        this.animalSpecieService.findById(this.animalSpecieId).subscribe(
            (animalSpecie: any) => {
                this.setLoading(false);
                this.animalSpecie = animalSpecie;
                this.initFormGroup();
            },
            (err: any) => {
                this.setLoading(false);
                console.error(err);
            }
        );
    }

    public onSubmit() {
        this.setSubmitForm(true);

        if (this.formGroup.valid) {
            this.setLoading(true);

            switch (this.mode) {
                case "create":
                    this.animalSpecieService
                        .create({
                            name: this.formGroup.value.name,
                            description: this.formGroup.value.description,
                        })
                        .subscribe(
                            (animalSpecie: AnimalSpeciesI) => {
                                if (animalSpecie) {
                                    this.router.navigate(["/animalSpecies/view"]);
                                }

                                this.setLoading(false);
                            },
                            (err: any) => {
                                console.log(err);
                                this.setLoading(false);
                            }
                        );
                break;

                case 'edit':
                    this.animalSpecieService
                            .updateById(this.animalSpecieId, { name: this.formGroup.value.name,
                                description: this.formGroup.value.description})
                            .subscribe(
                                (animalSpecie: AnimalSpeciesI) => {
                                    if (animalSpecie) {
                                        this.router.navigate(["/animalSpecies/view" + this.animalSpecieId])
                                    }
                                    this.setLoading(false);
                                },
                                (err: any) => {
                                    this.setErrors(err.errors);
                                    this.setLoading(false);
                                });
                    break;

            }
        }
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            id: [this.animalSpecie.id_as ? this.animalSpecie.id_as : null],
            name: [
                this.animalSpecie.name ? this.animalSpecie.name : null,
                Validators.required,
            ],
            description: [
                this.animalSpecie.description
                    ? this.animalSpecie.description
                    : null,
                Validators.required,
            ],
        });
    }
}
