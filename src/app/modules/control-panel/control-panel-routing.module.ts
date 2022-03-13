import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelComponent } from '@panel/pages/panel/panel.component';
import { AnimalSpeciesListComponent } from './pages/animal-species/animal-species.list.component';
import { PathologiesComponent } from './pages/pathologies/pathologies.component';
import { MedicationsComponent } from './pages/medications/medications.component';
import { ArrhythmiasComponent } from './pages/arrhythmias/arrhythmias.component';
import { ScenarioParamsComponent } from './pages/scenario-params/scenario-params.component';
import { ScenarioParamsCreateComponent } from './pages/scenario-params-create/scenario-params-create.component';
import { ParametersComponent } from './pages/parameters/parameters.component';

const routes: Routes = [
    { path: '', component: PanelComponent },
    { path: 'animalSpecie', component: AnimalSpeciesListComponent },
    { path: 'pathologies', component: PathologiesComponent },
    { path: 'medications', component: MedicationsComponent },
    { path: 'arrhythmias', component: ArrhythmiasComponent },
    { path: 'scenarios', component: ScenarioParamsComponent },
    { path: 'scenarios/create', component: ScenarioParamsCreateComponent },
    { path: 'scenarios/edit/:id', component: ScenarioParamsCreateComponent },
    { path: 'parameters', component: ParametersComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ControlPanelRoutingModule {}
