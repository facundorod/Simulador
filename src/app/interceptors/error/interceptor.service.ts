import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
    constructor(private router: Router, private toast: ToastrService) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // Intercepta todos las peticiones Http
        let message: string;
        const request = req;
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status >= 400 && err.status < 500) {
                    if (err.status == 401 || err.status == 412) {
                        message = `You don't have access`;
                        localStorage.removeItem('authToken');
                    } else {
                        message = err.message;
                    }
                    this.router.navigateByUrl('/auth/login');
                }
                if (err.status >= 500) {
                    message = `Something bad has happened!`;
                    this.router.navigateByUrl('/home');
                }
                this.toast.toastrConfig.timeOut = 1000;
                this.toast.error('Retry again!', `${message}`);

                return throwError(message);
            })
        );
    }
}
