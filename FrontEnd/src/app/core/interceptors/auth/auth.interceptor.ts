import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private router : Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accesToken = localStorage.getItem('ACCESS_TOKEN');
    if ( accesToken ){
      return next.handle(this.addToken(request, accesToken))
        .pipe(
          catchError((error:any) => {
            switch(error.status) {
              case 401:
                this.handle401Error(request, next);
                return;
            }
            return throwError(error);
          })
        )
    }
    return next.handle(request.clone());
  }

  addToken(request: HttpRequest<any>, accesToken: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.append('Authorization', `Bearer ${accesToken}`)
    });
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    this.tokenSubject.next(null);
		this.router.navigate(['/login']);
  }
}
