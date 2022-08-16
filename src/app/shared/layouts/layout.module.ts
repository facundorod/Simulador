import { SharedModule } from '@app/shared/shared.module';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelLayoutComponent } from './panelLayout/panel-layout.component';
import { SidebarModule } from 'ng-sidebar';
import { SimulationLayoutComponent } from './simulationLayout/simulation-layout.component';
import { NewComponent } from './new/new.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([]),
        SharedModule,
        SidebarModule.forRoot(),
    ],
    exports: [MainComponent, PanelLayoutComponent, SimulationLayoutComponent],
    declarations: [
        MainComponent,
        PanelLayoutComponent,
        SimulationLayoutComponent,
        NewComponent,
    ],
})
export class LayoutModule { }
