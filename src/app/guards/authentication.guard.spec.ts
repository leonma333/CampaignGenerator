import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        {
          provide: AuthenticationService,
          useValue: jasmine.createSpyObj('mockAuthenticationService', ['isLoggedIn'])
        },
      ]
    });
    guard = TestBed.inject(AuthenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
