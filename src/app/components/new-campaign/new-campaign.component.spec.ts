import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';

import { of } from 'rxjs';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';

import { Schedule } from '../../models/schedule';
import { campaigns } from '../../mocks/campaigns';
import { CampaignService } from '../../services/campaign.service';
import { NewCampaignComponent } from './new-campaign.component';
import { SchedulePickerComponent } from '../shared/schedule-picker/schedule-picker.component';

describe('Component: NewCampaignComponent', () => {
  let component: NewCampaignComponent;
  let fixture: ComponentFixture<NewCampaignComponent>;
  let mockCampaignService: any;
  let mockLocation: any;
  let mockRouter: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [QuillModule.forRoot(), ReactiveFormsModule, RouterTestingModule],
      providers: [
        Location, {
          provide: CampaignService,
          useValue: jasmine.createSpyObj('mockCampaignService', ['byId', 'add'])
        }, {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ],
      declarations: [ NewCampaignComponent, QuillEditorComponent, SchedulePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCampaignComponent);
    component = fixture.componentInstance;

    mockCampaignService = TestBed.inject(CampaignService);
    mockCampaignService.add.and.returnValue(new Promise(resolve => resolve(true)));

    mockLocation = TestBed.inject(Location);
    spyOn(mockLocation, 'back');

    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.campaignForm.valid).toBeFalsy();

    const name = component.campaignForm.controls.name;
    expect(name.valid).toBeFalsy();

    const errors = name.errors;
    expect(errors.required).toBeTruthy();

    const saveEl: DebugElement = fixture.debugElement.query(By.css('button.save'));
    expect(saveEl.nativeElement.disabled).toBeTrue();
  });

  it('form valid when name not empty', () => {
    component.campaignForm.controls.name.setValue('first campaign');
    fixture.detectChanges();

    expect(component.campaignForm.controls.name.valid).toBeTruthy();

    const errors = component.campaignForm.controls.name.errors;
    expect(errors).toBeNull();

    const saveEl: DebugElement = fixture.debugElement.query(By.css('button.save'));
    expect(saveEl.nativeElement.disabled).toBeFalse();
  });

  it('should call back when click back button', () => {
    const backEl: DebugElement = fixture.debugElement.query(By.css('button.back'));

    backEl.nativeElement.click();
    fixture.detectChanges();
    expect(mockLocation.back.calls.count()).toEqual(1);
  });

  describe('without id param', () => {
    it('should not display anything', () => {
      const de: DebugElement = fixture.debugElement;
      const nameEl: DebugElement = de.query(By.css('input.name'));
      const editorEl: DebugElement = de.query(By.css('.ql-editor'));

      expect(nameEl.nativeElement.value).toEqual('');
      expect(editorEl.nativeElement.innerText.trim()).toEqual('');
      expect(component.campaignForm.controls.name.value).toEqual('');
      expect(component.campaignForm.controls.content.value).toBeNull();
      expect(component.campaignForm.controls.schedule.value).toEqual(Schedule.default());
    });

    it('should change value and save', fakeAsync(() => {
      const de: DebugElement = fixture.debugElement;
      const nameEl: DebugElement = de.query(By.css('input.name'));
      const saveEl: DebugElement = fixture.debugElement.query(By.css('button.save'));

      nameEl.nativeElement.value = 'My campaign';
      nameEl.nativeElement.dispatchEvent(new Event('input'));

      component.campaignForm.controls.content.setValue('This is my campaign');
      component.campaignForm.controls.schedule.setValue({type: 'recurring'});

      fixture.detectChanges();

      expect(component.campaignForm.controls.name.value).toEqual('My campaign');

      saveEl.nativeElement.click();
      tick();

      expect(mockRouter.navigate.calls.count()).toBe(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      expect(mockCampaignService.add.calls.count()).toEqual(1);
      expect(mockCampaignService.add).toHaveBeenCalledWith('My campaign', 'This is my campaign', {type: 'recurring'});
    }));
  });

  describe('with id param', () => {
    beforeEach(() => {
      mockCampaignService.byId.and.returnValue(of(campaigns[0]));

      const mockActivatedRoute: any = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
      mockActivatedRoute.queryParams = of({id: '1'});

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display corresponding campaign content', () => {
      const de: DebugElement = fixture.debugElement;
      const nameEl: DebugElement = de.query(By.css('input.name'));
      const editorEl: DebugElement = de.query(By.css('.ql-editor'));

      expect(nameEl.nativeElement.value).toBe('first campaign');
      expect(editorEl.nativeElement.innerText.trim()).toBe('Foo');
      expect(component.campaignForm.controls.schedule.value).toEqual(campaigns[0].schedule);
    });

    it('should add new campaign', fakeAsync(() => {
      const de: DebugElement = fixture.debugElement;
      const nameEl: DebugElement = de.query(By.css('input.name'));
      const saveEl: DebugElement = fixture.debugElement.query(By.css('button.save'));

      nameEl.nativeElement.value = 'Another campaign';
      nameEl.nativeElement.dispatchEvent(new Event('input'));

      component.campaignForm.controls.content.setValue('This is another campaign');
      component.campaignForm.controls.schedule.setValue({type: 'recurring'});

      fixture.detectChanges();
      saveEl.nativeElement.click();
      tick();

      expect(mockRouter.navigate.calls.count()).toBe(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      expect(mockCampaignService.add.calls.count()).toEqual(1);
      expect(mockCampaignService.add).toHaveBeenCalledWith('Another campaign', 'This is another campaign', {type: 'recurring'});
    }));
  });
});
