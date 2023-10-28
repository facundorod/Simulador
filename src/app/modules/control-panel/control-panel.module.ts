import { ScenarioService } from './services/scenario.service';
import { AnimalSpeciesService } from './services/animalSpecies.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { AuthorizationModule } from '@auth/authorization.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { SharedModule } from '@app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { CurvesService } from './services/curves.service';
import { MonitorService } from '../monitor/services/monitor.service';
import { MonitorModule } from '../monitor/monitor.module';
import { NibpComponent } from './modals/nibp/nibp.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RefCurvesComponent } from './modals/ref-curves/ref-curves.component';
import { Panel2Component } from './pages/panel2/panel2.component';
import { ParametersRangesComponent } from './components/parameters-ranges/parameters-ranges.component';
import { ParameterBoxComponent } from './components/parameter-box/parameter-box.component';
import { InterpolatorService } from './services/interpolator.service';
import { MonitorSoundsComponent } from './modals/monitor-sounds/monitor-sounds.component';

@NgModule({
    declarations: [
        // PanelComponent,
        // AnimalSpeciesListComponent,
        // PathologiesComponent,
        // MedicationsComponent,
        // ArrhythmiasComponent,
        // ModalEditComponent,
        // ModalEditComponentArr,
        // ModalEditComponentPath,
        // ModalEditComponentMed,
        // ScenariosComponent,
        // ScenarioParamsComponent,
        // ScenarioParamsCreateComponent,
        // ParametersCreateComponent,
        // ParametersComponent,
        // NewParameterComponent,
        // MonitorConfigsComponent,
        // ScenarioCloneComponent,
        NibpComponent,
        RefCurvesComponent,
        Panel2Component,
        ParametersRangesComponent,
        ParameterBoxComponent,
        MonitorSoundsComponent,
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
        // SimulationModule,
        MonitorModule,
    ],
    exports: [],
    providers: [
        AnimalSpeciesService,
        // ArrhythmiasService,
        // MedicationsService,
        // PathologiesService,
        ScenarioService,
        // SimulationService,
        CurvesService,
        MonitorService,
        // ParametersService,
        InterpolatorService
    ],
})
export class ControlPanelModule { }
