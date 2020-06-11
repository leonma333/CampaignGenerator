import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';

import { FireAuthStub } from '../mocks/fireauth';
import { AuthenticationService } from './authentication.service';

describe('Service: AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: AngularFireAuth, useClass: FireAuthStub }
      ]
    });
    service = TestBed.inject(AuthenticationService);
    localStorage.setItem('user', null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#googleLogin', (done) => {
    expect(service.isLoggedIn).toBeFalse();
    service.googleLogin().then(result => {
      expect(result).toEqual({user: {emailVerified: true}});
      expect(service.isLoggedIn).toBeTrue();
      done();
    });
  });

  it('#isLoggedIn', () => {
    expect(service.isLoggedIn).toBeFalse();
    localStorage.setItem('user', JSON.stringify({emailVerified: false}));
    expect(service.isLoggedIn).toBeFalse();
    localStorage.setItem('user', JSON.stringify({emailVerified: true}));
    expect(service.isLoggedIn).toBeTrue();

    const mockFireAuth = TestBed.inject(AngularFireAuth) as any;
    mockFireAuth.emitEmptyUser();
    expect(service.isLoggedIn).toBeFalse();
  });
});
