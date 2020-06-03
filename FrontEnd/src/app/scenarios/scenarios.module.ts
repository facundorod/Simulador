import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from './charts/charts.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';



@NgModule({
  declarations: [ChartsComponent, ControlPanelComponent],
  imports: [
    CommonModule
  ]
})
export class ScenariosModule { }
