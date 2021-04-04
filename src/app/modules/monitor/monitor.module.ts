import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimulationModule } from "../simulation/simulation.module";
import { SimulatorComponent } from "./pages/simulator/simulator.component";
import { CurvesService } from "../control-panel/services/curves.service";
import { MonitorRoutingModule } from "./monitor-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [SimulatorComponent],
    imports: [
        CommonModule,
        SimulationModule,
        MonitorRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [CurvesService],
})
export class MonitorModule {}
