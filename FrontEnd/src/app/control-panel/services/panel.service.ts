import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  constructor(private httpClient: HttpClient) { }

  getScenarios() {
    return this.httpClient.get(environment.apiGetScenarios);
  }

  getAnimalSpecies(){
    return this.httpClient.get(environment.apiGetAnimalSpecies);
  }
}
