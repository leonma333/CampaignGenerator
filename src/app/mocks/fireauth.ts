import { Observable, Subject } from 'rxjs';

export class FireAuthStub {
  authState: Observable<any>;
  private authStateChanges$: Subject<any> = new Subject();

  constructor() {
    this.authState = this.authStateChanges$.asObservable();
  }

  signInWithPopup(provider: any): Promise<any> {
    const result = {user: {emailVerified: true}, provider: provider.providerId};
    this.authStateChanges$.next(result.user);
    return Promise.resolve(result);
  }

  emitEmptyUser(): void {
    this.authStateChanges$.next(null);
  }
}
