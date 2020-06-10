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

@NgModule({
  declarations: [SimulationComponent,  NavbarUserComponent, PanelComponent ,AnimalSpeciesComponent, ScenariosComponent, MedicationComponent, ArrhythmiaComponent, ScenarioNameComponent, SimulationDescriptionComponent],
  imports: [
    CommonModule,
    ControlPanelRoutingModule,

    MatSliderModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
  ],
  exports: [
    SimulationComponent,
    AnimalSpeciesComponent,
    ScenariosComponent
  ]
})
export class ControlPanelModule { }