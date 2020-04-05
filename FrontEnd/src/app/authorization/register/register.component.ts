import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  nombre: string;
  apellido: string;
  password: string;
  usuario: string;

  constructor(private login: LoginService) { }

  ngOnInit() {
  }

  sign(){
    console.log(this.nombre + this.apellido + this.password + this.usuario);
  }

}
