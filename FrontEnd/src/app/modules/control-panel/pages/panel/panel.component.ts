import { Component, OnInit } from '@angular/core';

// Service
import { PanelService } from '@services/panel.service';

// Models
import { PathologyI } from '@models/pathologyI';
import { MedicationI } from '@models/medicationI';
import { ArrhythmiaI } from '@models/arrhythmiaI';
import { AnimalSpeciesI } from '@models/animal-speciesI';
import { ScenarioI } from '@models/scenarioI';


@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  // Models - DTO
  animalSpecies : AnimalSpeciesI[];
  arrhythmias : ArrhythmiaI[];
  medications : MedicationI[];
  pathologies : PathologyI[];
  scenarios : ScenarioI[];
  mode: String = 'user';

  constructor(private panelService : PanelService) { }

  ngOnInit(): void {

    this.panelService.getAnimalSpecies()
      .subscribe((animalSpecies: AnimalSpeciesI[]) => {
        this.animalSpecies = animalSpecies;
      })

    this.panelService.getArrhythmia()
      .subscribe((arrhythmias: ArrhythmiaI[]) => {
        this.arrhythmias = arrhythmias;
      })

    this.panelService.getMedication()
      .subscribe((medications : MedicationI[])=> {
        this.medications = medications;
      })

    this.panelService.getPathology()
      .subscribe((pathologies : PathologyI[]) => {
        this.pathologies = pathologies;
      })

    this.panelService.getScenarios()
      .subscribe((scenarios : ScenarioI[]) => {
        this.scenarios = scenarios;
      })

  }

/*
  TrackByFn: Define como rastrear los cambios en los ítems utilizados en el *ngFor.
  Aumenta el rendimiento, ya que solo se vuelven a representar en el DOM los nodos
  que han sido actualizados.
*/
  trackByFnAnimalSpecies(index: number, name: AnimalSpeciesI): number {
    return name.id_as;
  }

  trackByFnMedications(index: number, name: MedicationI): number {
    return name.id_medication;
  }

  trackByFnArrhythmias(index: number, name: ArrhythmiaI): number {
    return name.id_arr;
  }

  trackByFnPathologies(index: number, name: PathologyI): number {
    return name.id_pat;
  }

  trackByFnScenarios(index: number, name: ScenarioI): number {
    return name.id_scenario;
  }

}
