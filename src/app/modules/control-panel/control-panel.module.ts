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
import { ModalEditComponent } from "./modals/animalSpecies/modal-edit/modal-edit.component";
import { ModalEditComponentArr } from "./modals/arrhythmias/modal-edit/modal-edit.component";
import { ModalEditComponentPath } from "./modals/pathologies/modal-edit/modal-edit.component";
import { ModalEditComponentMed } from "./modals/medications/modal-edit/modal-edit.component";

import { CurvesService } from "./services/curves.service";
import { SimulationModule } from "../simulation/simulation.module";
import { MonitorService } from "../monitor/services/monitor.service";
import { ScenarioParamsComponent } from "./pages/scenario-params/scenario-params.component";
import { ScenarioParamsCreateComponent } from "./pages/scenario-params-create/scenario-params-create.component";
import { ParametersCreateComponent } from "./modals/parameters-create/parameters-create.component";
import { ParametersService } from "./services/parameters.service";

@NgModule({
    declarations: [
        PanelComponent,
        ScenariosCreateComponent,
        AnimalSpeciesListComponent,
        PathologiesComponent,
        MedicationsComponent,
        ArrhythmiasComponent,
        ModalEditComponent,
        ModalEditComponentArr,
        ModalEditComponentPath,
        ModalEditComponentMed,
        ScenariosComponent,
        ScenarioParamsComponent,
        ScenarioParamsCreateComponent,
        ParametersCreateComponent,
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
        SimulationModule,
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
        MonitorService,
        ParametersService,
    ],
})
export class ControlPanelModule {}
