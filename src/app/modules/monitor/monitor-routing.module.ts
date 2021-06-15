import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CurvesService } from "../control-panel/services/curves.service";
import { SimulatorComponent } from "./pages/simulator/simulator.component";

const routes: Routes = [{ path: "", component: SimulatorComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CurvesService],
})
export class MonitorRoutingModule {}
