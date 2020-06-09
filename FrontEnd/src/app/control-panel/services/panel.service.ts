import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { AnimalSpecies } from '@app/models/animal-species';
import { Scenario } from '@app/models/scenario';
import { Medication } from '@app/models/medication';
import { Arrhythmia } from '@app/models/arrhythmia';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  constructor(private httpClient: HttpClient) { }

  getScenarios(): Observable<Scenario[]> {
    return this.httpClient.get<Scenario[]>(environment.apiGetScenarios);
  }

  getAnimalSpecies(): Observable<AnimalSpecies[]> {
    return this.httpClient.get<AnimalSpecies[]>(environment.apiGetAnimalSpecies);
  }

  getMedication(): Observable<Medication[]> {
    return this.httpClient.get<Medication[]>(environment.apiGetMedication);
  }

  getArrhythmia(): Observable<Arrhythmia[]> {
    return this.httpClient.get<Arrhythmia[]>(environment.apiGetArrhythmia);
  }
}
