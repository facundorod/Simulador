import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CurvesService } from "../control-panel/services/curves.service";
import { CurvesComponent } from "./components/curves/curves.component";
import { NewComponent } from "./pages/new/new.component";
import { SimulatorComponent } from "./pages/simulator/simulator.component";

const routes: Routes = [
    { path: "new", component: NewComponent },
    // { path: "curves", component: CurvesComponent },
    { path: "monitor", component: SimulatorComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CurvesService],
})
export class SimulationRoutingModule {}
