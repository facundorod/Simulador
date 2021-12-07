import { AuthService } from "@services/auth.service";
import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { FormsModule } from "@angular/forms";
import { RegisterComponent } from "./register/register.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { LogoutComponent } from "./logout/logout.component";
import { SharedModule } from "@app/shared/shared.module";
import { MonitorConfigurationService } from "@app/shared/services/monitor.service";

@NgModule({
    declarations: [LoginComponent, RegisterComponent, LogoutComponent],
    imports: [AuthRoutingModule, SharedModule, FormsModule],
    exports: [LogoutComponent],
    providers: [AuthService, MonitorConfigurationService],
})
export class AuthorizationModule {}
