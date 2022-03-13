import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    name: String;
    surname: String;
    password: String;
    email: String;
    institution: String;
    constructor(
        private authService: AuthService,
        private toast: ToastrService,
        private router: Router
    ) { }

    ngOnInit() { }

    sign() {
        this.authService
            .register({
                email: this.email,
                name: this.name,
                surname: this.surname,
                password: this.password,
                institution: this.institution,
            })
            .subscribe(() => {
                this.router.navigateByUrl('/auth/login');
                this.toast.toastrConfig.timeOut = 1000;
                this.toast.toastrConfig.positionClass = 'toast-bottom-full-width';
                this.toast.success('Your account has been created');
            });
    }
}
