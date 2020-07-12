import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelComponent } from '@panel/pages/panel/panel.component';
import { AnimalSpeciesComponent } from './pages/animal-species/animal-species.component';


const routes: Routes = [
  { path: '', component: PanelComponent},
  { path: 'animalSpecie', component: AnimalSpeciesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule { }
