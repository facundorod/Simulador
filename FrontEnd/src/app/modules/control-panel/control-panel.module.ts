import { AnimalSpeciesService } from './services/animalSpecies.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { PanelComponent } from '@panel/pages/panel/panel.component';
import { AuthorizationModule } from '@auth/authorization.module';
import { AnimalSpeciesListComponent } from './pages/animal-species/list/animal-species.list.component';
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
    AnimalSpeciesListComponent,
    PathologiesComponent,
    MedicationsComponent,
    ArrhythmiasComponent ,
  ],
  imports: [
    CommonModule,
    ControlPanelRoutingModule,
    ReactiveFormsModule,
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
