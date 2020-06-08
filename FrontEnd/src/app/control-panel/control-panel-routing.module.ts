import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimulationComponent } from './panel/simulation/simulation.component';
import { AnimalSpeciesComponent } from './panel/animal-species/animal-species.component';
import { ScenariosComponent } from './panel/scenarios/scenarios.component';


const routes: Routes = [{ path: 'simulation', component: SimulationComponent },
                        { path: 'animals', component: AnimalSpeciesComponent },
                        { path: 'scenarios', component: ScenariosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule { }
