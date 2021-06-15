import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimulationModule } from "../simulation/simulation.module";
import { SimulatorComponent } from "./pages/simulator/simulator.component";
import { CurvesService } from "../control-panel/services/curves.service";
import { MonitorRoutingModule } from "./monitor-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MonitorService } from "./services/monitor.service";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
    declarations: [SimulatorComponent],
    imports: [
        CommonModule,
        SimulationModule,
        MonitorRoutingModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
    ],
    providers: [CurvesService, MonitorService],
})
export class MonitorModule { }
