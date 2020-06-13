import { AuthService } from '@auth/services/auth.service';
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
  constructor(private authService: AuthService, private toast: ToastrService) { }

  ngOnInit() {
  }

  sign(){
    this.authService.register(this.email, this.name, this.surname, this.password, this.institution)
    .subscribe(res => {
        this.toast.success(res.toString());
      } )


  }

}
