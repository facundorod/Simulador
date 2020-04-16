import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(private router: Router, private toast: ToastrService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): import("rxjs").Observable<HttpEvent<any>> {
     // Intercepta todos los errores posibles en peticiones Http
    const token: string = localStorage.getItem('Token');
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
        this.toast.error(err.error);
        this.router.navigateByUrl('/login');
        return throwError(err);

      })
    );
  }

  
}
