import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { AnimalSpeciesI } from '@models/animal-speciesI';
import { ScenarioI } from '@models/scenarioI';
import { MedicationI } from '@models/medicationI';
import { ArrhythmiaI } from '@models/arrhythmiaI';
import { PathologyI } from '@models/pathologyI';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  constructor(private httpClient: HttpClient) { }

  getScenarios(): Observable<ScenarioI[]> {
    return this.httpClient.get<ScenarioI[]>(environment.apiGetScenarios);
  }

  getAnimalSpecies(): Observable<AnimalSpeciesI[]> {
    return this.httpClient.get<AnimalSpeciesI[]>(environment.apiGetAnimalSpecies);
  }

  getMedication(): Observable<MedicationI[]> {
    return this.httpClient.get<MedicationI[]>(environment.apiGetMedication);
  }

  getArrhythmia(): Observable<ArrhythmiaI[]> {
    return this.httpClient.get<ArrhythmiaI[]>(environment.apiGetArrhythmia);
  }

  getPathology(): Observable<PathologyI[]> {
    return this.httpClient.get<PathologyI[]>(environment.apiGetPathology);
  }

  insertAnimalSpecies() {
    return this.httpClient.post(environment.apiInsertAnimalSpecies, {
      name: "Testnuevo",
      description: "TestDesc",
    });
  }
}
