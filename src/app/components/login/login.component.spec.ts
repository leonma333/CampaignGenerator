import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick  } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../../services/authentication.service';

describe('Component: LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockRouter: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ LoginComponent ],
      providers: [
        {
          provide: AuthenticationService,
          useValue: jasmine.createSpyObj('mockAuthenticationService', ['googleLogin'])
        },
      ]
    })
    .compileComponents();

    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate');

    const mockAuthenticationService = TestBed.inject(AuthenticationService) as any;
    mockAuthenticationService.googleLogin.and.returnValue(new Promise(resolve => resolve(true)));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to dashboard page when login with Google', fakeAsync(() => {
    const googleEl: DebugElement = fixture.debugElement.query(By.css('.google-login'));
    googleEl.nativeElement.click();

    tick();
    fixture.detectChanges();

    expect(mockRouter.navigate.calls.count()).toBe(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['dashboard']);
  }));
});
