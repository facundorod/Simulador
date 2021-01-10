import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  surname: String;
  password: String;
  email: String;
  institution: String;
  mode: String = 'home';
  constructor(private authService: AuthService, private toast: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  sign(){
    this.authService.register(this.email, this.name, this.surname, this.password, this.institution)
    .subscribe(res => {
        this.toast.success('Your account has been created');
        this.router.navigateByUrl('/home');
      });


  }

}
