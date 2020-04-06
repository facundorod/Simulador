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

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  
  login(user:String, psw: String){ 
    
    return this.http.post(this.pathLogin, {user:user, psw:psw } );

  }


  constructor(private http:HttpClient) { }
}