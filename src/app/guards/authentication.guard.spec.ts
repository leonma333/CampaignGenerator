import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('Guard: AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        {
          provide: AuthenticationService,
          useValue: jasmine.createSpyObj('mockAuthenticationService', {isLoggedIn: true})
        }
      ]
    });
    guard = TestBed.inject(AuthenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('#canActivate', () => {
    let mockRouter: any;
    let mockAuthenticationService: any;

    beforeEach(() => {
      mockAuthenticationService = TestBed.inject(AuthenticationService);
      mockRouter = TestBed.inject(Router);
      spyOn(mockRouter, 'navigate');
    });

    it('should return true if logged in', () => {
      mockAuthenticationService.isLoggedIn = true;
      expect(guard.canActivate()).toBeTrue();
    });

    it('should return false and redirect if not logged in', () => {
      mockAuthenticationService.isLoggedIn = false;
      expect(guard.canActivate()).toBeFalse();
      expect(mockRouter.navigate.calls.count()).toBe(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
