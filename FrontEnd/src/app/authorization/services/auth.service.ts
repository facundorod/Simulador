import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login(email:String, password: String){
    return this.http.post(environment.apiLogin, {email: email, password:password } );
  }

  register(e_mail:String, name: String, surname: String, password: String, institution: String){
    return this.http.post(environment.apiRegister, {
      e_mail: e_mail,
      name: name,
      surname: surname,
      password: password,
      institution: institution
    });
  }

  public isLogged() : boolean {
    const token = localStorage.getItem('Token');
    if (token != undefined) {
      return true;
    }
    return false;
  }

  logout(){
    localStorage.removeItem('Token');
  }

}
