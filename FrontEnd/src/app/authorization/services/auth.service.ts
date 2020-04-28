import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  pathLogin = "http://localhost:8001/api/login";
  pathUpdate = "http://localhost:8001/api/updateUsers";
  pathGetUsers = "http://localhost:8001/api/getUsers";
  pathRegister = "http://localhost:8001/api/register";

  constructor(private http:HttpClient) { }
  
  login(e_mail:String, password: String){ 
    return this.http.post(this.pathLogin, {e_mail: e_mail, password:password } );
  }

  register(e_mail:String, name: String, surname: String, password: String, institution: String){
    return this.http.post(this.pathRegister, {
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