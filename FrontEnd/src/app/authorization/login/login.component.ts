import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import {ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  e_mail:String;
  password:String;

  constructor(private loginService: LoginService, private toast: ToastrService) { }


  login(){
    this.loginService.login(this.e_mail, this.password)
    .subscribe(token => {
      localStorage.setItem('Token', JSON.stringify(token));
     // this.toast.success('Login Sucessful');
    }); 
  }

  showSuccess(){
    this.toast.success('Exito', 'T');
  }

  ngOnInit() {
  }

}
