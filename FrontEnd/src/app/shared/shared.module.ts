import { ApiService } from './services/api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@app/shared/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './layouts/main/main.component';
import { SidebarModule } from 'ng-sidebar';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SidebarModule.forRoot()
  ],
  exports: [NavbarComponent],
  providers: [
      ApiService
  ]
})
export class SharedModule { }
