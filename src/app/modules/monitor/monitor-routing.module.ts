import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurvesService } from '../control-panel/services/curves.service';
import { MonitorComponent } from './pages/simulator/monitor.component';

const routes: Routes = [{ path: '', component: MonitorComponent, data: {title: 'SIMVet - Monitor'} }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CurvesService],
})
export class MonitorRoutingModule { }
