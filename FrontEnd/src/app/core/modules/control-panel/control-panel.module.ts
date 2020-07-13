import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { PanelComponent } from '@panel/pages/panel/panel.component';
import { NavbarUserComponent } from '@app/shared/navbar-user/navbar-user.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { AuthorizationModule } from '@auth/authorization.module';
import { AnimalSpeciesComponent } from './pages/animal-species/animal-species.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { PathologiesComponent } from './pages/pathologies/pathologies.component';
import { MedicationsComponent } from './pages/medications/medications.component';
import { ArrhythmiasComponent } from './pages/arrhythmias/arrhythmias.component';


@NgModule({
  declarations: [
    NavbarUserComponent,
    PanelComponent,
    AnimalSpeciesComponent,
    PathologiesComponent,
    MedicationsComponent,
    ArrhythmiasComponent ,
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
    AuthorizationModule,
    FormsModule,
    ToastrModule.forRoot(),
  ],
  exports: [
  ]
})
export class ControlPanelModule { }
