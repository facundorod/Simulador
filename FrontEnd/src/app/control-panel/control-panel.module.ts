import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationComponent } from './panel/simulation/simulation.component';
import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { AnimalSpeciesComponent } from './panel/animal-species/animal-species.component';
import { ScenariosComponent } from './panel/scenarios/scenarios.component';
import { MedicationComponent } from './panel/medication/medication.component';
import { ArrhythmiaComponent } from './panel/arrhythmia/arrhythmia.component';


@NgModule({
  declarations: [SimulationComponent, AnimalSpeciesComponent, ScenariosComponent, MedicationComponent, ArrhythmiaComponent],
  imports: [
    CommonModule,
    ControlPanelRoutingModule,
  ]
})
export class ControlPanelModule { }
