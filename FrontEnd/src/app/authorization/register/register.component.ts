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
  constructor(private login: LoginService) { }

  ngOnInit() {
  }

  sign(){
    this.login.register(this.email, this.name, this.surname, this.password, this.institution).subscribe(data => {
      console.log(data);
    });
  }

}
