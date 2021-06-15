import { SharedModule } from "@app/shared/shared.module";
import { MainComponent } from "./main/main.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PanelLayoutComponent } from "./panelLayout/panel-layout.component";
import { SidebarModule } from "ng-sidebar";
import { SimulationLayoutComponent } from "./simulationLayout/simulation-layout.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([]),
        FlexLayoutModule,
        SharedModule,
        SidebarModule.forRoot(),
    ],
    exports: [MainComponent, PanelLayoutComponent, SimulationLayoutComponent],
    declarations: [
        MainComponent,
        PanelLayoutComponent,
        SimulationLayoutComponent,
    ],
})
export class LayoutModule {}
