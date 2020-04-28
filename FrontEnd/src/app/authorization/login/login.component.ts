import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  e_mail:String;
  password:String;
  submit: Boolean = false;

  constructor(private authService: AuthService, private toast: ToastrService, private router:Router) { }


  login(){
    this.toast.toastrConfig.timeOut = 1000;
    this.toast.toastrConfig.positionClass = "toast-bottom-full-width"; 
    this.authService.login(this.e_mail, this.password)
    .subscribe( res => {
      // Logueo exitoso
      localStorage.setItem('Token', JSON.stringify(res));
      this.submit = true;
      this.toast.success("Login successful");
      this.router.navigateByUrl('/charts');
      
      // En caso de error lo intercepta el servicio Interceptor.
    });
  }

  ngOnInit() {
  }

}
