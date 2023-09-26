import { SimulationService } from './../simulation/services/simulation.service';
import { ScenariosComponent } from './pages/scenarios/scenarios.component';
import { ScenarioService } from './services/scenario.service';
import { PathologiesService } from './services/pathologies.service';
import { MedicationsService } from './services/medications.service';
import { ArrhythmiasService } from './services/arrhythmias.service';
import { AnimalSpeciesService } from './services/animalSpecies.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { PanelComponent } from '@panel/pages/panel/panel.component';
import { AuthorizationModule } from '@auth/authorization.module';
import { AnimalSpeciesListComponent } from './pages/animal-species/animal-species.list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { PathologiesComponent } from './pages/pathologies/pathologies.component';
import { MedicationsComponent } from './pages/medications/medications.component';
import { ArrhythmiasComponent } from './pages/arrhythmias/arrhythmias.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditComponent } from './modals/animalSpecies/modal-edit/modal-edit.component';
import { ModalEditComponentArr } from './modals/arrhythmias/modal-edit/modal-edit.component';
import { ModalEditComponentPath } from './modals/pathologies/modal-edit/modal-edit.component';
import { ModalEditComponentMed } from './modals/medications/modal-edit/modal-edit.component';

import { CurvesService } from './services/curves.service';
import { SimulationModule } from '../simulation/simulation.module';
import { MonitorService } from '../monitor/services/monitor.service';
import { ScenarioParamsComponent } from './pages/scenario-params/scenario-params.component';
import { ScenarioParamsCreateComponent } from './pages/scenario-params-create/scenario-params-create.component';
import { ParametersCreateComponent } from './modals/parameters-create/parameters-create.component';
import { ParametersService } from './services/parameters.service';
import { MonitorModule } from '../monitor/monitor.module';
import { ParametersComponent } from './pages/parameters/parameters.component';
import { NewParameterComponent } from './modals/new-parameter/new-parameter.component';
import { MonitorConfigsComponent } from './modals/monitor-configs/monitor-configs.component';
import { ScenarioCloneComponent } from './modals/scenario-clone/scenario-clone.component';
import { NibpComponent } from './modals/nibp/nibp.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RefCurvesComponent } from './modals/ref-curves/ref-curves.component';
import { Panel2Component } from './pages/panel2/panel2.component';
import { ParametersRangesComponent } from './components/parameters-ranges/parameters-ranges.component';
import { ParameterBoxComponent } from './components/parameter-box/parameter-box.component';

@NgModule({
    declarations: [
        PanelComponent,
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
        ParametersComponent,
        NewParameterComponent,
        MonitorConfigsComponent,
        ScenarioCloneComponent,
        NibpComponent,
        RefCurvesComponent,
        Panel2Component,
        ParametersRangesComponent,
        ParameterBoxComponent,
    ],
    imports: [
        CommonModule,
        ControlPanelRoutingModule,
        ReactiveFormsModule,
        AuthorizationModule,
        FormsModule,
        NgApexchartsModule,
        ToastrModule.forRoot(),
        SharedModule,
        NgbModule,
        SimulationModule,
        MonitorModule,
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
export class ControlPanelModule { }
