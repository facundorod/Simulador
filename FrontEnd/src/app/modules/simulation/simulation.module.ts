import { ScenariosModalComponent } from "./modals/scenarios-modal/scenarios-modal.component";
import { ScenarioService } from "./../control-panel/services/scenario.service";
import { SimulationService } from "./services/simulation.service";
import { SimulationsComponent } from "./modals/simulations/simulations.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SimulationRoutingModule } from "./simulation-routing.module";
import { NewComponent } from "./pages/new/new.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [NewComponent, SimulationsComponent, ScenariosModalComponent],
    imports: [
        CommonModule,
        SimulationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [SimulationService, ScenarioService],
})
export class SimulationModule {}
