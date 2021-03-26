import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpErrorResponse,
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError, Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
@Injectable({
    providedIn: "root",
})
export class InterceptorService implements HttpInterceptor {
    constructor(private router: Router, private toast: ToastrService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // Intercepta todos los errores posibles en peticiones Http
        let message;
        let request = req;
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                console.log(err);
                message = err.message;
                this.toast.toastrConfig.timeOut = 0;
                this.toast.error("Retry again!", `${message}`);
                this.router.navigateByUrl("/auth/login");
                return throwError(message);
            })
        );
    }
}