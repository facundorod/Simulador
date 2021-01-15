import { AuthSession } from './services/authSession.service';
import { ConfirmModalComponent } from './modals/confirm/confirm-modal.component';
import { MessageComponent } from './components/message/message.component';
import { MainTitleComponent } from './layouts/main-title/main-title.component';
import { ApiService } from './services/api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@app/shared/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'ng-sidebar';

@NgModule({
  declarations: [NavbarComponent, MainTitleComponent, MessageComponent, ConfirmModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SidebarModule.forRoot()
  ],
  exports: [NavbarComponent, MainTitleComponent, MessageComponent, ConfirmModalComponent],
  providers: [
      ApiService,
      AuthSession
  ]
})
export class SharedModule { }
