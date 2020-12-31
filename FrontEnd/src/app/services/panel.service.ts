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
    return this.httpClient.get<ScenarioI[]>(environment.apiScenario);
  }

  getAnimalSpecies(): Observable<AnimalSpeciesI[]> {
    return this.httpClient.get<AnimalSpeciesI[]>(environment.apiAnimalSpecies);
  }

  getMedication(): Observable<MedicationI[]> {
    return this.httpClient.get<MedicationI[]>(environment.apiMedication);
  }

  getArrhythmia(): Observable<ArrhythmiaI[]> {
    return this.httpClient.get<ArrhythmiaI[]>(environment.apiArrhythmia);
  }

  getPathology(): Observable<PathologyI[]> {
    return this.httpClient.get<PathologyI[]>(environment.apiPathology);
  }

}