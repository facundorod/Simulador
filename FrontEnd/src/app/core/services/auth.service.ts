import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { JwtResponseI } from '@app/shared/models/jwt-responseI';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login(email:String, password: String) : Observable<JwtResponseI>{
    return this.http.post<JwtResponseI>(`${environment.apiUsers}/login`,
      {email: email, password:password } )
      .pipe( tap(
        (res: JwtResponseI) => {
          if (res) {
            this.saveToken(res.accesToken, res.expiresIn);
          }
        }
      )
      )
  }

  register(e_mail:String, name: String, surname: String, password: String,
      institution: String) : Observable<JwtResponseI> {
    return this.http.post<JwtResponseI>(`${environment.apiUsers}/register`, {
      email: e_mail,
      name: name,
      surname: surname,
      password: password,
      institution: institution
    });
  }

  public isLogged(): boolean {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token){
      return true
    }
    return false;
  }

  private saveToken(token: string, expiresIn: string): void {
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.setItem('EXPIRESIN', expiresIn);
  }


  logout(){
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('EXPIRESIN');

  }

}
