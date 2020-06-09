import { Component, OnInit } from '@angular/core';
import { PanelService } from '@app/control-panel/services/panel.service';
import { AnimalSpecies } from '@app/models/animal-species';


@Component({
  selector: 'app-animal-species',
  templateUrl: './animal-species.component.html',
  styleUrls: ['./animal-species.component.css']
})
export class AnimalSpeciesComponent implements OnInit {

  animalSpecies : AnimalSpecies[];

  constructor(private panelService: PanelService) { }

  ngOnInit(): void {
    this.panelService.getAnimalSpecies()
      .subscribe((animalSpecies: AnimalSpecies[]) => {
        this.animalSpecies = animalSpecies;
      })
  }

  trackByFn(index: number, name: AnimalSpecies): number {
    return name.id_as;
  }

}
