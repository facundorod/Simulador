import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { MonitorConfigurationService } from '@app/shared/services/monitor.service';
import { MonitorI } from '@app/shared/models/monitorI';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    email: String;
    password: String;
    isLoading: boolean = false;
    submit: Boolean = false;
    constructor(
        private authService: AuthService,
        private toast: ToastrService,
        private router: Router,
        private monitorConfiguration: MonitorConfigurationService
    ) { }

    login() {
        this.isLoading = true;
        this.authService.login(this.email, this.password).subscribe(
            () => {
                this.isLoading = false;

                // Logueo exitoso
                this.router.navigate(['/panel/']);
                this.submit = true;
                const auth = JSON.parse(localStorage.getItem('authToken'));
                const { user } = auth;
                this.toast.toastrConfig.timeOut = 1000;
                this.toast.toastrConfig.positionClass = 'toast-bottom-left';
                this.toast.toastrConfig.closeButton = true;
                this.toast.success(`Welcome ${user.name}!`);
                if (auth.user.roles.includes('admin')) {
                    this.loadMonitorConfiguration();
                }
                // En caso de error lo intercepta el servicio Interceptor.
            },
            (error: any) => {
                this.isLoading = false;
                console.log(error);
            }
        );
    }

    ngOnInit() { }

    private loadMonitorConfiguration(): void {
        this.monitorConfiguration.getMonitorConfiguration().subscribe(
            (value: MonitorI) => {
                if (value) {
                    localStorage.setItem('monitor', JSON.stringify(value));
                }
            },
            (error: Error) => {
                console.error(error);
            }
        );
    }
}
