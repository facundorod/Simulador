import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationModule } from '../simulation/simulation.module';
import { MonitorComponent } from './pages/simulator/monitor.component';
import { CurvesService } from '../control-panel/services/curves.service';
import { MonitorRoutingModule } from './monitor-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonitorService } from './services/monitor.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MiniMonitorComponent } from './components/mini-monitor/mini-monitor.component';
import { Monitor2Component } from './monitor2/monitor2.component';
import { ChartComponent } from './components/chart/chart.component';

@NgModule({
    declarations: [MonitorComponent, MiniMonitorComponent, Monitor2Component, ChartComponent],
    imports: [
        CommonModule,
        SimulationModule,
        MonitorRoutingModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        NgApexchartsModule,
    ],
    providers: [CurvesService, MonitorService],
    exports: [MiniMonitorComponent],
})
export class MonitorModule {}
