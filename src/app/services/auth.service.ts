import { UserI } from "./../shared/models/userI";
import { ApiService } from "./../shared/services/api.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";
import { Subject } from "rxjs";
import { JwtResponseI } from "@app/shared/models/jwt-responseI";
import { AuthSession } from "@app/shared/services/authSession.service";
import { UserTokenI } from "@app/shared/models/userTokenI";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor(private api: ApiService, private http: HttpClient) { }

    login(email: String, password: String) {
        const subject = new Subject<any>();

        const endpoint = environment.api.login;

        const body = {
            email,
            password,
        };

        this.api.httpPost(endpoint, body).subscribe(
            (authUser: any) => {
                AuthSession.saveAuthToken(JSON.stringify(authUser));
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

    register(userData: UserI) {
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
                subject.next();
            }
        );

        return subject.asObservable();
    }

    public isAdmin(): boolean {
        const { user }: UserTokenI = JSON.parse(localStorage.getItem('authToken'));
        if (user) {
            const isAdmin = user.roles.filter((rol) => {
                return rol.name == 'admin'
            })
            if (isAdmin.length > 0) return true;
            return false;
        }
        return false;
    }

    public isLogged(): boolean {
        const token = localStorage.getItem("authToken");
        if (token) {
            return true;
        }
        return false;
    }

    logout() {
        AuthSession.logOut();
    }
}
