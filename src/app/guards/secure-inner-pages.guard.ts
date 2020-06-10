import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SecureInnerPagesGuard implements CanActivate {
  constructor(
    public authService: AuthenticationService,
    public router: Router
  ){ }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['dashboard']);
    }
    return true;
  }
}
