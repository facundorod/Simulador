import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    constructor(
        private authSvc: AuthService,
        private router: Router
    ) { }

    canActivate(): boolean {
        const statusUser = this.authSvc.isLogged();
        if (statusUser == true) {
            this.router.navigateByUrl("/simulation");
        }
        return true;
    }

}
