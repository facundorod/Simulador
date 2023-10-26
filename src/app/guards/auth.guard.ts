import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

        if (!statusUser) {
            this.toast.toastrConfig.timeOut = 1000;
            this.toast.toastrConfig.positionClass =
                'toast-bottom-full-width';
            this.toast.error(
                'You don\'t have access!'
            );
            this.router.navigateByUrl('/home');
            return false;
        }

        return this.checkUserSession();
    }

    private checkUserSession() {
        const userInfoLogged = localStorage.getItem('authToken');
        if (userInfoLogged) {
            const { access_token } = JSON.parse(userInfoLogged);
            return this.authSvc.isValidSession(access_token)
                .pipe(
                    map((validSession: boolean) => {
                        if (!validSession) {
                            this.toast.toastrConfig.timeOut = 1000;
                            this.toast.toastrConfig.positionClass =
                                'toast-bottom-full-width';
                            this.toast.error(
                                `You don't have access!`
                            );
                            localStorage.clear();
                            this.router.navigateByUrl('/home');
                        }

                        return validSession
                    }),
                    catchError(error => of(false))
                )
        } else return false;
    }
}
