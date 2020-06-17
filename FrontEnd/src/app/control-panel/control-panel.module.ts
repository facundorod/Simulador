import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationComponent } from './panel/simulation/simulation.component';
import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { AnimalSpeciesComponent } from './panel/animal-species/animal-species.component';
import { ScenariosComponent } from './panel/scenarios/scenarios.component';
import { MedicationComponent } from './panel/medication/medication.component';
import { ArrhythmiaComponent } from './panel/arrhythmia/arrhythmia.component';
import { PanelComponent } from './panel/panel.component';
import { ScenarioNameComponent } from './panel/scenario-name/scenario-name.component';
import { SimulationDescriptionComponent } from './panel/simulation-description/simulation-description.component';
import { NavbarUserComponent } from '@app/shared/navbar-user/navbar-user.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PathologyComponent } from './panel/pathology/pathology.component';
import { CycleCardiacComponent } from './panel/cycle-cardiac/cycle-cardiac.component';
import { TemperatureComponent } from './panel/temperature/temperature.component';
import { RespirationComponent } from './panel/respiration/respiration.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { AuthorizationModule } from '@app/authorization/authorization.module';
import { ManageDatabaseComponent } from './manage-database/manage-database.component';


@NgModule({
  declarations: [
    SimulationComponent,
    NavbarUserComponent,
    PanelComponent ,
    AnimalSpeciesComponent,
    ScenariosComponent,
    MedicationComponent,
    ArrhythmiaComponent,
    ScenarioNameComponent,
    SimulationDescriptionComponent,
    PathologyComponent,
    CycleCardiacComponent,
    TemperatureComponent,
    RespirationComponent,
    ManageDatabaseComponent
  ],
  imports: [
    CommonModule,
    ControlPanelRoutingModule,
    MatSliderModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatListModule,
    AuthorizationModule
  ],
  exports: [
    SimulationComponent,
    AnimalSpeciesComponent,
    ScenariosComponent
  ]
})
export class ControlPanelModule { }
