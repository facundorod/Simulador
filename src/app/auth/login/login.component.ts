import { AuthService } from "@services/auth.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { ToastrService } from "ngx-toastr";
import { MonitorConfigurationService } from "@app/shared/services/monitor.service";
import { MonitorI } from "@app/shared/models/monitorI";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
    email: String;
    password: String;
    submit: Boolean = false;
    constructor(
        private authService: AuthService,
        private toast: ToastrService,
        private router: Router,
        private monitorConfiguration: MonitorConfigurationService
    ) {}

    login() {
        this.toast.toastrConfig.timeOut = 1000;
        this.toast.toastrConfig.positionClass = "toast-bottom-left";
        this.toast.toastrConfig.closeButton = true;
        this.authService.login(this.email, this.password).subscribe(
            () => {
                // Logueo exitoso
                this.router.navigateByUrl("/simulation/new");
                this.submit = true;
                this.toast.success("Login successful... Welcome");
                this.loadMonitorConfiguration();
                // En caso de error lo intercepta el servicio Interceptor.
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    ngOnInit() {}

    private loadMonitorConfiguration(): void {
        this.monitorConfiguration.getMonitorConfiguration().subscribe(
            (value: MonitorI) => {
                if (value) {
                    localStorage.setItem("monitor", JSON.stringify(value));
                }
            },
            (error: Error) => {
                console.error(error);
            }
        );
    }
}
