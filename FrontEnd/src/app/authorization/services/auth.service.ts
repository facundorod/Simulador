import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  
  login(e_mail:String, password: String){ 
    return this.http.post(environment.apiLogin, {e_mail: e_mail, password:password } );
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


  logout(){
    localStorage.removeItem('Token');
  }

}