import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private authSvc: AuthService,
        private router: Router,
        private toast: ToastrService
    ) { }

    canActivate() {
        const statusUser = this.authSvc.isLogged();
        if (statusUser == true) {
            return true;
        }
        this.toast.toastrConfig.timeOut = 1000;
        this.toast.toastrConfig.positionClass =
            'toast-bottom-full-width';
        this.toast.error(
            'You don\'t have access!'
        );
        this.router.navigateByUrl('/home');
        return false;
    }
}
