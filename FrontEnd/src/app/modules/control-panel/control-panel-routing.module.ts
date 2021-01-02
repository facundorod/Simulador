import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PanelComponent } from "@panel/pages/panel/panel.component";
import { AnimalSpeciesListComponent } from "./pages/animal-species/list/animal-species.list.component";
import { PathologiesComponent } from "./pages/pathologies/pathologies.component";
import { MedicationsComponent } from "./pages/medications/medications.component";
import { ArrhythmiasComponent } from "./pages/arrhythmias/arrhythmias.component";

const routes: Routes = [
    { path: "", component: PanelComponent },
    { path: "animalSpecie", component: AnimalSpeciesListComponent },
    { path: "pathologies", component: PathologiesComponent },
    { path: "medications", component: MedicationsComponent },
    { path: "arrhythmias", component: ArrhythmiasComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ControlPanelRoutingModule {}
