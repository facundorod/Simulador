import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimulationComponent } from './panel/simulation/simulation.component';
import { AnimalSpeciesComponent } from './panel/animal-species/animal-species.component';
import { ScenariosComponent } from './panel/scenarios/scenarios.component';
import { MedicationComponent } from './panel/medication/medication.component';
import { ArrhythmiaComponent } from './panel/arrhythmia/arrhythmia.component';
import { PanelComponent } from './panel/panel.component';


const routes: Routes = [
  { path: 'simulation', component: SimulationComponent },
  { path: 'animals', component: AnimalSpeciesComponent },
  { path: 'scenarios', component: ScenariosComponent },
  { path: 'medications', component: MedicationComponent },
  { path: 'arrhythmias', component: ArrhythmiaComponent },
  { path: '', component: PanelComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule { }
