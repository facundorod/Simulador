import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationComponent } from './panel/simulation/simulation.component';
import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { AnimalSpeciesComponent } from './panel/animal-species/animal-species.component';
import { ScenariosComponent } from './panel/scenarios/scenarios.component';



@NgModule({
  declarations: [SimulationComponent, AnimalSpeciesComponent, ScenariosComponent],
  imports: [
    CommonModule,
    ControlPanelRoutingModule
  ]
})
export class ControlPanelModule { }
