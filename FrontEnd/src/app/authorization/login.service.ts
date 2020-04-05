import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  rutaLogin = "http://localhost:8001/api/login";
  rutaUpdate = "http://localhost:8001/api/updateUsers";
  rutaGetUsers = "http://localhost:8001/api/getUsers";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  
  login(usuario:String, psw: String){ 
    
    return this.http.post(this.rutaLogin, {usuario:usuario, psw:psw } );

  }


  constructor(private http:HttpClient) { }
}