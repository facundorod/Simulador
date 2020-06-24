import { Component, OnInit } from '@angular/core';
import { PanelService } from '@controlPanel/services/panel.service';
import { AnimalSpeciesI } from '@models/animal-speciesI';


@Component({
  selector: 'app-animal-species',
  templateUrl: './animal-species.component.html',
  styleUrls: ['./animal-species.component.css']
})
export class AnimalSpeciesComponent implements OnInit {

  animalSpecies : AnimalSpeciesI[];

  constructor(private panelService: PanelService) { }

  ngOnInit(): void {
    this.panelService.getAnimalSpecies()
      .subscribe((animalSpecies: AnimalSpeciesI[]) => {
        this.animalSpecies = animalSpecies;
      })
  }

  trackByFn(index: number, name: AnimalSpeciesI): number {
    return name.id_as;
  }

}
