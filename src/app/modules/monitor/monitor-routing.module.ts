import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurvesService } from '../control-panel/services/curves.service';
import { Monitor2Component } from './monitor2/monitor2.component';

const routes: Routes = [
    // { path: 'monitor2', component: MonitorComponent, data: { title: 'SIMVet - Monitor' } },
    { path: '', component: Monitor2Component, data: { title: 'Vital Signs Monitor - SIMVet' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CurvesService],
})
export class MonitorRoutingModule { }
