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
  insertPathologies(pathologie:string, pathologieDescription:string){
    return this.http.post(environment.apiGetPathology, {
      name:pathologie,
      description:pathologieDescription
    })
  }
  insertMedications (medication:string, medicationDescription:string){
    return this.http.post(environment.apiGetMedication,{
      name: medication,
      description:medicationDescription
    })
  }

  insertArrhythmias (arrhythmia:string, arrhythmiaDescription:string){
    return this.http.post(environment.apiGetArrhythmia, {
      name: arrhythmia,
      description:arrhythmiaDescription
    })
  }
}
