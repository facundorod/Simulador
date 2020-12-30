import { AnimalSpeciesService } from './services/animalSpecies.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { PanelComponent } from '@panel/pages/panel/panel.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { AuthorizationModule } from '@auth/authorization.module';
import { AnimalSpeciesComponent } from './pages/animal-species/animal-species.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { PathologiesComponent } from './pages/pathologies/pathologies.component';
import { MedicationsComponent } from './pages/medications/medications.component';
import { ArrhythmiasComponent } from './pages/arrhythmias/arrhythmias.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    PanelComponent,
    AnimalSpeciesComponent,
    PathologiesComponent,
    MedicationsComponent,
    ArrhythmiasComponent ,
  ],
  imports: [
    CommonModule,
    ControlPanelRoutingModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatListModule,
    AuthorizationModule,
    FormsModule,
    ToastrModule.forRoot(),
    SharedModule,
    NgbModule
  ],
  exports: [
  ],
  providers: [
      AnimalSpeciesService
  ]
})
export class ControlPanelModule { }
