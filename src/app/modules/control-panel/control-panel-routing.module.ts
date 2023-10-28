import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Panel2Component } from './pages/panel2/panel2.component';

const routes: Routes = [
    // { path: 'v2', component: PanelComponent, data: { title: 'SIMVet - Control Panel' } },
    { path: '', component: Panel2Component, data: { title: 'Control Panel - SIMVet' } },
    // { path: 'animalSpecie', component: AnimalSpeciesListComponent },
    // { path: 'pathologies', component: PathologiesComponent },
    // { path: 'medications', component: MedicationsComponent },
    // { path: 'arrhythmias', component: ArrhythmiasComponent },
    // { path: 'scenarios', component: ScenarioParamsComponent },
    // { path: 'scenarios/create', component: ScenarioParamsCreateComponent },
    // { path: 'scenarios/edit/:id', component: ScenarioParamsCreateComponent },
    // { path: 'parameters', component: ParametersComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ControlPanelRoutingModule {}
