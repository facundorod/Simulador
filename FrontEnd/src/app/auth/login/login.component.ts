import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:String;
  password:String;
  submit: Boolean = false;
  toggle: Boolean = false;
  mode: string = 'home';
  constructor(private authService: AuthService, private toast: ToastrService, private router:Router) {
    this.toggle=false;
   }


  login(){
    this.toast.toastrConfig.timeOut = 1000;
    this.toast.toastrConfig.positionClass = "toast-bottom-full-width";
    this.authService.login(this.email, this.password)
    .subscribe( () => {

      // Logueo exitoso
      this.router.navigateByUrl('/simulation/new');
      this.submit = true;
      this.toast.success("Login successful");
      // En caso de error lo intercepta el servicio Interceptor.
    });
  }


  collapse() : void {
    this.toggle = !this.toggle;
  }

  ngOnInit() {
  }

}
