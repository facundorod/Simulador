import { AnimalSpeciesI } from './../../../shared/models/animal-speciesI';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './animal-specie-edit.component.html',
    styleUrls: ['./animal-specie-edit.component.css']
})
export class AnimalSpeciesEditComponent extends BaseComponent implements OnInit {

    public animalSpecie: AnimalSpeciesI;

    constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) {
        super();
    }

    ngOnInit(){
        this.initFormGroup();
    }

    private initFormGroup() {
        this.formGroup = this.fb.group({
            name: [ this.animalSpecie ? this.animalSpecie.name : '', Validators.required ],
            description: [ this.animalSpecie ? this.animalSpecie.description : '' ]
        });
    }

    public setAnimalSpecie(animal: AnimalSpeciesI) {
        this.animalSpecie = animal;
    }

    onSubmit() {
        this.setSubmitForm(true);
        if (this.formGroup.valid) {
            this.activeModal.close(this.formGroup.value);
        }
    }

    onCancel() {
        this.activeModal.close();
	}

}
