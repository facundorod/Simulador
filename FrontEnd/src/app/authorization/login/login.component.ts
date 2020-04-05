import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario:String;
  psw:String;
  submitted=false;

  login(usuario:String, psw:String){
    //this.loginService.login(usuario, psw).subscribe((user:Usuario) => console.log(user));
  }


  updateUser(){
    // this.user = { nombreUsuario: "Facu", password: "Facu95" };
    // this.loginService.updateUser(this.user).subscribe( (data) => {
    //   console.log(data);
    // })

  }

  onSubmit(){
    this.submitted = true;
  }

  
  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

}
