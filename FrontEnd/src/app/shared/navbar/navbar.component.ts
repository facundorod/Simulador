import { AuthService } from '@auth/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService]
})
export class NavbarComponent implements OnInit {

  public isLogged : boolean = false; 



  constructor(private authService: AuthService) { }

  ngOnInit(): void {
      //this.isLogged = true;
  }

}
