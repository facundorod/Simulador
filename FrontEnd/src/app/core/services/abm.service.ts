import { PathologyI } from './../../shared/models/pathologyI';
import { ArrhythmiaI } from './../../shared/models/arrhythmiaI';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbmService {

  constructor(private http: HttpClient) { }
  insertAnimalSpecies(nameAnimal:string){
    return this.http.post(environment.apiInsertAnimalSpecies, {
      name:nameAnimal
    });
  }


  insertPathologies(pathology: PathologyI){
    return this.http.post( environment.apiPathology, {
      name:pathology.id_pat,
      description:pathology.description
    })
  }


  insertMedications (medication:string, medicationDescription:string){
    return this.http.post(environment.apiMedication,{
      name: medication,
      description:medicationDescription
    })
  }

  insertArrhythmias (arrhythmia:string, arrhythmiaDescription:string){
    return this.http.post(environment.apiArrhythmia, {
      name: arrhythmia,
      description:arrhythmiaDescription
    })
  }

  deleteArrhythmia(arr: ArrhythmiaI) {
    return this.http.delete(`${environment.apiArrhythmia}/${arr.id_arr}`);
  }

}
