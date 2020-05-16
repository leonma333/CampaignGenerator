import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';

import { of } from 'rxjs';
import { QuillModule } from 'ngx-quill';

import { Campaign } from '../../models/campaign';
import { campaigns } from '../../mocks/campaigns';
import { CampaignService } from '../../services/campaign.service';
import { EditCampaignComponent } from './edit-campaign.component';
import { QuillComponent } from '../shared/quill/quill.component';
import { SchedulePickerComponent } from '../shared/schedule-picker/schedule-picker.component';

describe('Component: EditCampaignComponent', () => {
  let component: EditCampaignComponent;
  let fixture: ComponentFixture<EditCampaignComponent>;
  let mockCampaignService: any;
  let mockLocation: any;
  let mockRouter: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [QuillModule.forRoot(), ReactiveFormsModule, RouterTestingModule],
      providers: [
        Location, {
          provide: CampaignService,
          useValue: jasmine.createSpyObj('mockCampaignService', ['byId', 'save'])
        }, {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: '1'
              })
            }
          }
        }
      ],
      declarations: [ EditCampaignComponent, QuillComponent, SchedulePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCampaignComponent);
    component = fixture.componentInstance;

    const campaign = new Campaign(campaigns[0].id, campaigns[0].name, campaigns[0].content, campaigns[0].schedule);

    mockCampaignService = TestBed.inject(CampaignService);
    mockCampaignService.byId.and.returnValue(of(campaign));
    mockCampaignService.save.and.returnValue(new Promise(resolve => resolve(true)));

    mockLocation = TestBed.inject(Location);
    spyOn(mockLocation, 'back');

    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form valid when name not empty', () => {
    expect(component.campaignForm.controls.name.valid).toBeTruthy();

    const errors = component.campaignForm.controls.name.errors;
    expect(errors).toBeNull();

    const saveEl: DebugElement = fixture.debugElement.query(By.css('button.save'));
    expect(saveEl.nativeElement.disabled).toBeFalse();
  });

  it('form invalid when empty', () => {
    const de: DebugElement = fixture.debugElement;
    const nameEl: DebugElement = de.query(By.css('input.name'));

    nameEl.nativeElement.value = '';
    nameEl.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.campaignForm.valid).toBeFalsy();

    const name = component.campaignForm.controls.name;
    expect(name.valid).toBeFalsy();

    const errors = name.errors;
    expect(errors.required).toBeTruthy();

    const saveEl: DebugElement = de.query(By.css('button.save'));
    expect(saveEl.nativeElement.disabled).toBeTrue();
  });

  it('should call back when click back button', () => {
    const backEl: DebugElement = fixture.debugElement.query(By.css('button.back'));

    backEl.nativeElement.click();
    fixture.detectChanges();
    expect(mockLocation.back.calls.count()).toEqual(1);
  });

  it('should handle error', fakeAsync(() => {
    mockCampaignService.save.and.returnValue(Promise.reject(new Error('error')));

    let alertEl: DebugElement = fixture.debugElement.query(By.css('ngb-alert'));
    expect(alertEl).toBeNull();

    const saveEl: DebugElement = fixture.debugElement.query(By.css('button.save'));
    saveEl.nativeElement.click();
    tick();
    fixture.detectChanges();

    alertEl = fixture.debugElement.query(By.css('ngb-alert'));
    expect(alertEl.nativeElement.textContent).toBe('error');
  }));

  it('should display campaign', () => {
    const de: DebugElement = fixture.debugElement;
    const nameEl: DebugElement = de.query(By.css('input.name'));
    const editorEl: DebugElement = de.query(By.css('.ql-editor'));

    expect(nameEl.nativeElement.value).toBe('first campaign');
    expect(editorEl.nativeElement.innerText.trim()).toBe('Foo');
    expect(component.campaignForm.controls.schedule.value).toEqual(campaigns[0].schedule);
  });

  it('should save edited campaign', fakeAsync(() => {
    const de: DebugElement = fixture.debugElement;
    const nameEl: DebugElement = de.query(By.css('input.name'));
    const saveEl: DebugElement = fixture.debugElement.query(By.css('button.save'));

    nameEl.nativeElement.value = 'Another campaign';
    nameEl.nativeElement.dispatchEvent(new Event('input'));

    component.campaignForm.controls.content.setValue({ ops: [{insert: 'This is another campaign'}] });
    component.campaignForm.controls.schedule.setValue({ type: 'recurring' });

    fixture.detectChanges();
    saveEl.nativeElement.click();
    tick();

    const campaign = new Campaign('1', 'Another campaign', {ops: [{insert: 'This is another campaign'}]}, {type: 'recurring'});

    expect(mockRouter.navigate.calls.count()).toBe(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(mockCampaignService.save.calls.count()).toEqual(1);
    expect(mockCampaignService.save).toHaveBeenCalledWith(campaign);
  }));
});
