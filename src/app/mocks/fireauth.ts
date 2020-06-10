import { Observable, Subject } from 'rxjs';

export class FireAuthStub {
  authState: Observable<any>;
  private authStateChanges$: Subject<any> = new Subject();

  constructor() {
    this.authState = this.authStateChanges$.asObservable();
  }

  signInWithPopup(provider: any): Promise<any> {
    this.authStateChanges$.next({emailVerified: true});
    return Promise.resolve('Authentication success');
  }

  emitEmptyUser(): void {
    this.authStateChanges$.next(null);
  }
}
