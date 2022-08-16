import { LogoutComponent } from './logout/logout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginGuard } from '@app/guards/login.guard';

const routes: Routes = [
    { path: 'login', canActivate: [LoginGuard], component: LoginComponent },
    { path: 'register', canActivate: [LoginGuard], component: RegisterComponent },
    { path: 'logout', component: LogoutComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule { }
