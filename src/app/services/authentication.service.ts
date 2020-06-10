import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified) ? true : false;
  }

  googleLogin(): Promise<any> {
    return new Promise<any>(resolve => {
      const provider = new auth.GoogleAuthProvider();
      this.afAuth.signInWithPopup(provider).then(result => resolve(result));
    });
  }
}
