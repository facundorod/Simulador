import { MedicationI } from './../shared/models/medicationI';
import { AnimalSpeciesI } from './../shared/models/animal-speciesI';
import { PathologyI } from './../shared/models/pathologyI';
import { ArrhythmiaI } from './../shared/models/arrhythmiaI';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbmService {

  constructor(private http: HttpClient) { }

  // Insert

  insertAnimalSpecies(animal: AnimalSpeciesI){
    return this.http.post(environment.apiAnimalSpecies, {
      name:animal.name
    });
  }


  insertPathologies(pathology: PathologyI){
    return this.http.post( environment.apiPathology, {
      name:pathology.id_pat,
      description:pathology.description
    })
  }


  insertMedications(medication:MedicationI){
    return this.http.post(environment.apiMedication,{
      name: medication.name,
      description:medication.description
    })
  }

  insertArrhythmias(arrhythmia: ArrhythmiaI){
    return this.http.post(environment.apiArrhythmia, {
      name: arrhythmia.name,
      description:arrhythmia.description
    })
  }


  // Delete
  deleteArrhythmia(arr: ArrhythmiaI) {
    return this.http.delete(`${environment.apiArrhythmia}/${arr.id_arr}`);
  }

  deletePathology(pat: PathologyI) {
    return this.http.delete(`${environment.apiPathology}/${pat.id_pat}`);
  }

  deleteAnimalSpecie(animalSpecie: AnimalSpeciesI) {
    return this.http.delete(`${environment.apiAnimalSpecies}/${animalSpecie.id_as}`);
  }

  // Update
  updateArrhythmia(arr: ArrhythmiaI){
    return this.http.put(`${environment.apiArrhythmia}/${arr.id_arr}`, {
      name: arr.name,
      description: arr.description
    })
  }

  updateAnimalSpecie(animal: AnimalSpeciesI){
    return this.http.put(`${environment.apiAnimalSpecies}/${animal.id_as}`, {
      name: animal.name,
    })
  }

  updatePathology(pat: PathologyI){
    return this.http.put(`${environment.apiPathology}/${pat.id_pat}`, {
      name: pat.name,
      description: pat.description
    });
  }

  updateMedication(med: MedicationI){
    return this.http.put(`${environment.apiMedication}/${med.id_medication}`, {
      name: med.name,
      description: med.description
    })
  }

}
