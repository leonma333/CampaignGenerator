import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SecureInnerPagesGuard } from './secure-inner-pages.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('SecureInnerPagesGuard', () => {
  let guard: SecureInnerPagesGuard;

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
    guard = TestBed.inject(SecureInnerPagesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
