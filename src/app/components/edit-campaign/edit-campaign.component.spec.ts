import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';

import { QuillModule, QuillEditorComponent } from 'ngx-quill';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { EditCampaignComponent } from './edit-campaign.component';

describe('Component: EditCampaignComponent', () => {
  let component: EditCampaignComponent;
  let fixture: ComponentFixture<EditCampaignComponent>;
  let mockCampaignService: any;
  let mockLocation: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [QuillModule.forRoot(), ReactiveFormsModule],
      providers: [
        CampaignService,
        Location, {
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
      declarations: [ EditCampaignComponent, QuillEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCampaignComponent);
    component = fixture.componentInstance;

    const campaign: Campaign = {
      id: '1',
      name: 'My campaign',
      content: { ops: [{insert: 'Hello world'}] }
    };

    mockCampaignService = TestBed.inject(CampaignService) as jasmine.SpyObj<CampaignService>;
    spyOn(mockCampaignService, 'byId').and.returnValue(campaign);
    spyOn(mockCampaignService, 'save');

    mockLocation = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    spyOn(mockLocation, 'back');

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

  it('should display campaign', () => {
    const de: DebugElement = fixture.debugElement;
    const nameEl: DebugElement = de.query(By.css('input.name'));
    const editorEl: DebugElement = de.query(By.css('.ql-editor'));

    expect(nameEl.nativeElement.value).toBe('My campaign');
    expect(editorEl.nativeElement.innerText.trim()).toBe('Hello world');
  });

  it('should display campaign', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const de: DebugElement = fixture.debugElement;
    const nameEl: DebugElement = de.query(By.css('input.name'));
    const editorEl: DebugElement = de.query(By.css('.ql-editor'));

    expect(nameEl.nativeElement.value).toBe('My campaign');
    expect(editorEl.nativeElement.innerText.trim()).toBe('Hello world');
  });

  it('should save edited campaign', () => {
    const de: DebugElement = fixture.debugElement;
    const nameEl: DebugElement = de.query(By.css('input.name'));
    const editorEl: DebugElement = de.query(By.css('.ql-editor'));
    const saveEl: DebugElement = fixture.debugElement.query(By.css('button.save'));

    nameEl.nativeElement.value = 'Another campaign';
    nameEl.nativeElement.dispatchEvent(new Event('input'));

    component.campaignForm.controls.content.setValue({ ops: [{insert: 'This is another campaign'}] });

    fixture.detectChanges();
    saveEl.nativeElement.click();
    fixture.detectChanges();

    const campaign: Campaign = {
      id: '1',
      name: 'Another campaign',
      content: { ops: [{insert: 'This is another campaign'}] }
    };

    expect(mockLocation.back.calls.count()).toEqual(1);
    expect(mockCampaignService.save.calls.count()).toEqual(1);
    expect(mockCampaignService.save).toHaveBeenCalledWith(campaign);
  });
});
