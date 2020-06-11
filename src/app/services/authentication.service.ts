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
    return (user !== null && user.email.length) ? true : false;
  }

  login(type: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let provider;
      if (type === 'google') {
        provider = new auth.GoogleAuthProvider();
      } else if (type === 'github') {
        provider = new auth.GithubAuthProvider();
      } else {
        reject('Invalid provider');
        return;
      }

      this.afAuth.signInWithPopup(provider).then(result => {
        localStorage.setItem('user', JSON.stringify(result.user));
        resolve(result);
      });
    });
  }
}
