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
}
