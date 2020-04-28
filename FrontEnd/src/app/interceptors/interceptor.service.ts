import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(private router: Router, private toast: ToastrService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     // Intercepta todos los errores posibles en peticiones Http
    const token: string = localStorage.getItem('Token');
    let message;
    let request = req;
    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${ token }`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.error == 'undefined'){
          message = err.message;
          this.toast.error(message);
        } else {
          message = err.error.message;
          this.toast.toastrConfig.timeOut = 0;
          this.toast.error("Retry again!", `${ message }`);
        }

        this.router.navigateByUrl('/login');
        return throwError(message);
      })
    );
  }

  
}
