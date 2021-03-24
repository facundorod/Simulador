import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CurvesComponent } from "./components/curves/curves.component";
import { NewComponent } from "./pages/new/new.component";

const routes: Routes = [
    { path: "new", component: NewComponent },
    { path: "curves", component: CurvesComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SimulationRoutingModule {}
