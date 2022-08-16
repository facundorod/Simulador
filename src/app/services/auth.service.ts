import { UserI } from './../shared/models/userI';
import { ApiService } from './../shared/services/api.service';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { AuthSession } from '@app/shared/services/authSession.service';
import { UserTokenI } from '@app/shared/models/userTokenI';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private clearTimeout: NodeJS.Timeout;
    constructor(private api: ApiService, private router: Router) { }

    public login(email: String, password: String) {
        const subject = new Subject<any>();

        const endpoint = environment.api.login;

        const body = {
            email,
            password,
        };

        this.api.httpPost(endpoint, body).subscribe(
            (authUser: UserTokenI) => {
                this.handleUser(authUser);
                subject.next(authUser);
            },
            (error: any) => {
                subject.error(error);
                console.log(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

   public register(userData: UserI) {
        const subject = new Subject<any>();

        const endpoint = environment.api.register;

        this.api.httpPost(endpoint, userData).subscribe(
            (newUser: UserI) => {
                subject.next(newUser);
            },
            (error: any) => {
                subject.error(error);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public isAdmin(): boolean {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            const { user }: UserTokenI = JSON.parse(localStorage.getItem('authToken'));
            if (user) {
                const isAdmin = user.roles.filter((rol) => {
                    return rol.name == 'admin';
                });
                if (isAdmin.length > 0) { return true; }
                return false;
            }
            return false;
        }
        return false;
    }

    public isLogged(): boolean {
        const token = localStorage.getItem('authToken');
        if (token) {
            return true;
        }
        return false;
    }

    public logout(): void {
        AuthSession.logOut();
        this.router.navigateByUrl('/auth/login');
        if (this.clearTimeout) {
            clearTimeout(this.clearTimeout);
        }
    }

    private handleUser(user:UserTokenI) {
        const expireDate = new Date(
            new Date().getTime() + +user.expiresIn * 1000
        );
        user.expireDate = expireDate;
        AuthSession.saveAuthToken(JSON.stringify(user));

        this.autoLogout(+user.expiresIn * 1000);
    }

    private autoLogout(expirationDate: number): void {

        this.clearTimeout = setTimeout(() => {
          this.logout();
        }, expirationDate);
    }
}
