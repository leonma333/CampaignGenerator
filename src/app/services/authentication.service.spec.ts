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

  describe('#login', () => {
    it('google login', (done) => {
      expect(service.isLoggedIn).toBeFalse();
      service.login('google').then(result => {
        expect(result).toEqual({user: {email: 'leon@lhm.rocks'}, provider: 'google.com'});
        expect(service.isLoggedIn).toBeTrue();
        done();
      });
    });

    it('github login', (done) => {
      expect(service.isLoggedIn).toBeFalse();
      service.login('github').then(result => {
        expect(result).toEqual({user: {email: 'leon@lhm.rocks'}, provider: 'github.com'});
        expect(service.isLoggedIn).toBeTrue();
        done();
      });
    });

    it('invalid login', (done) => {
      expect(service.isLoggedIn).toBeFalse();
      service.login('lhm').catch(err => {
        expect(err).toBe('Invalid provider');
        expect(service.isLoggedIn).toBeFalse();
        done();
      });
    });
  });

  it('#isLoggedIn', () => {
    expect(service.isLoggedIn).toBeFalse();
    localStorage.setItem('user', JSON.stringify({email: ''}));
    expect(service.isLoggedIn).toBeFalse();
    localStorage.setItem('user', JSON.stringify({email: 'leon@lhm.rocks'}));
    expect(service.isLoggedIn).toBeTrue();

    const mockFireAuth = TestBed.inject(AngularFireAuth) as any;
    mockFireAuth.emitEmptyUser();
    expect(service.isLoggedIn).toBeFalse();
  });
});
