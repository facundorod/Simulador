import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

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
  constructor(private login: LoginService, private toast: ToastrService) { }

  ngOnInit() {
  }

  sign(){
    this.login.register(this.email, this.name, this.surname, this.password, this.institution)
    .subscribe(res => {
        this.toast.success(res.toString());
      } )

  
  }

}
