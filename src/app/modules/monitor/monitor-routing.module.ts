import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurvesService } from '../control-panel/services/curves.service';
import { MonitorComponent } from './pages/simulator/monitor.component';
import { Monitor2Component } from './monitor2/monitor2.component';

const routes: Routes = [
    { path: '', component: MonitorComponent, data: { title: 'SIMVet - Monitor' } },
    { path: 'monitor2', component: Monitor2Component, data: { title: 'SIMVet - Monitor 2' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CurvesService],
})
export class MonitorRoutingModule { }
