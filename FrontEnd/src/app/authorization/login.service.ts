import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  pathLogin = "http://localhost:8001/api/login";
  pathUpdate = "http://localhost:8001/api/updateUsers";
  pathGetUsers = "http://localhost:8001/api/getUsers";
  pathRegister = "http://localhost:8001/api/register"
/*   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  }; */


  constructor(private http:HttpClient) { }
  
  login(e_mail:String, password: String){ 
    console.log(e_mail);
    console.log(password);
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
}