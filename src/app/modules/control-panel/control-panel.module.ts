import { SimulationService } from "./../simulation/services/simulation.service";
import { ScenariosCreateComponent } from "./modals/scenarios-create/scenarios-create.component";
import { ScenariosComponent } from "./pages/scenarios/scenarios.component";
import { ScenarioService } from "./services/scenario.service";
import { PathologiesService } from "./services/pathologies.service";
import { MedicationsService } from "./services/medications.service";
import { ArrhythmiasService } from "./services/arrhythmias.service";
import { AnimalSpeciesService } from "./services/animalSpecies.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlPanelRoutingModule } from "./control-panel-routing.module";
import { PanelComponent } from "@panel/pages/panel/panel.component";
import { AuthorizationModule } from "@auth/authorization.module";
import { AnimalSpeciesListComponent } from "./pages/animal-species/animal-species.list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { PathologiesComponent } from "./pages/pathologies/pathologies.component";
import { MedicationsComponent } from "./pages/medications/medications.component";
import { ArrhythmiasComponent } from "./pages/arrhythmias/arrhythmias.component";
import { SharedModule } from "@app/shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AnimalSpeciesEditComponent } from "./modals/animal-specie-edit/animal-specie-edit.component";
import { CurvesService } from "./services/curves.service";

@NgModule({
    declarations: [
        PanelComponent,
        ScenariosCreateComponent,
        AnimalSpeciesListComponent,
        PathologiesComponent,
        MedicationsComponent,
        ArrhythmiasComponent,
        AnimalSpeciesEditComponent,
        ScenariosComponent,
    ],
    imports: [
        CommonModule,
        ControlPanelRoutingModule,
        ReactiveFormsModule,
        AuthorizationModule,
        FormsModule,
        ToastrModule.forRoot(),
        SharedModule,
        NgbModule,
    ],
    exports: [],
    providers: [
        AnimalSpeciesService,
        ArrhythmiasService,
        MedicationsService,
        PathologiesService,
        ScenarioService,
        SimulationService,
        CurvesService,
    ],
})
export class ControlPanelModule {}