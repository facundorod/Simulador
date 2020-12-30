import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authSvc : AuthService, private router: Router){}


  canActivate(){
    const statusUser = this.authSvc.isLogged();
    if (statusUser == true) {
      return true
    }
    this.router.navigateByUrl('/home');
    return false;
  }

}
