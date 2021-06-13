import { ScenariosModalComponent } from "./modals/scenarios-modal/scenarios-modal.component";
import { ScenarioService } from "./../control-panel/services/scenario.service";
import { SimulationService } from "./services/simulation.service";
import { SimulationsComponent } from "./modals/simulations/simulations.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import * as echarts from "echarts";
import { NgxEchartsModule } from "ngx-echarts";
import { SimulationRoutingModule } from "./simulation-routing.module";
import { NewComponent } from "./pages/new/new.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CurvesComponent } from "./components/curves/curves.component";

@NgModule({
    declarations: [
        NewComponent,
        SimulationsComponent,
        ScenariosModalComponent,
        CurvesComponent,
    ],
    imports: [
        CommonModule,
        SimulationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxEchartsModule.forRoot({
            echarts,
        }),
    ],
    exports: [CurvesComponent],
    providers: [SimulationService, ScenarioService],
})
export class SimulationModule { }
