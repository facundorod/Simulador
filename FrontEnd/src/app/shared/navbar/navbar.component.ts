import { AuthService } from '@app/core/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService]
})
export class NavbarComponent implements OnInit {

  public isLogged : boolean = false;
  public toggle : boolean;
  constructor(private authService: AuthService) {
    this.toggle = false;
  }

  ngOnInit(): void {

  }

  setLogged(s : boolean ) {
    this.isLogged = s;
  }

  collapse() : void {
    this.toggle = !this.toggle;
  }




}
