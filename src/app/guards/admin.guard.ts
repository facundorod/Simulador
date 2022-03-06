import { Injectable } from "@angular/core";
import {
    CanActivate,
    Router,
} from "@angular/router";
import { AuthService } from "@app/services/auth.service";

@Injectable({
    providedIn: "root",
})
export class AdminGuard implements CanActivate {
    constructor(private authSvc: AuthService, private router: Router) { }

    canActivate(): boolean {
        return this.authSvc.isAdmin();
    }
}
