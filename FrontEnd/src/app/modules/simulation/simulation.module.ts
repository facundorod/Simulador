import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulationRoutingModule } from './simulation-routing.module';
import { NewComponent } from './pages/new/new.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [NewComponent],
  imports: [
    CommonModule,
    SimulationRoutingModule,
    FormsModule
  ]
})
export class SimulationModule { }
