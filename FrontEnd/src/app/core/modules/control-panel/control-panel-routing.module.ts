import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelComponent } from '@panel/pages/panel/panel.component';
import { ManageDatabaseComponent } from './manage-database/manage-database.component';


const routes: Routes = [
  { path: '', component: PanelComponent},
  { path: 'manage', component: ManageDatabaseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule { }
