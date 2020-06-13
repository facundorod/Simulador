import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { JwtResponseI } from '@app/models/jwt-responseI';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:String;
  password:String;
  submit: Boolean = false;

  constructor(private authService: AuthService, private toast: ToastrService, private router:Router) { }


  login(){
    this.toast.toastrConfig.timeOut = 1000;
    this.toast.toastrConfig.positionClass = "toast-bottom-full-width";
    this.authService.login(this.email, this.password)
    .subscribe( () => {
      // Logueo exitoso
      this.router.navigateByUrl('panel');
      this.submit = true;
      this.toast.success("Login successful");
      // En caso de error lo intercepta el servicio Interceptor.
    });
  }

  ngOnInit() {
  }

}
