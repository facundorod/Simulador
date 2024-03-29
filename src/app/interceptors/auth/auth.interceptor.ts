import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthSession } from '@app/shared/services/authSession.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private router: Router) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const authToken: any = JSON.parse(AuthSession.getAuthToken());
        if (authToken) {
            const cloned = req.clone({
                headers: req.headers.set(
                    'Authorization',
                    `Bearer ${authToken.access_token}`
                ),
            });

            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}
