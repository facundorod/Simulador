
import { AuthService } from '@services/auth.service';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, LogoutComponent],
  imports: [
    AuthRoutingModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    LogoutComponent
  ],
  providers: [AuthService]
})
export class AuthorizationModule { }
