import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authService: AuthenticationService, private router: Router) { }

  login(provider: string){
    this.authService.login(provider).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
