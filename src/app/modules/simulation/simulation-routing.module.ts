import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CurvesService } from "../control-panel/services/curves.service";
import { NewComponent } from "./pages/new/new.component";

const routes: Routes = [
    { path: "new", component: NewComponent },
    // { path: "curves", component: CurvesComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CurvesService],
})
export class SimulationRoutingModule {}
