import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';

import { of } from 'rxjs';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { NewCampaignComponent } from './new-campaign.component';

describe('Component: NewCampaignComponent', () => {
  const campaign: Campaign = {
    id: '1',
    name: 'My campaign',
    content: { ops: [{insert: 'Hello world'}] }
  };

  let component: NewCampaignComponent;
  let fixture: ComponentFixture<NewCampaignComponent>;
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
            queryParams: of({})
          }
        }
      ],
      declarations: [ NewCampaignComponent, QuillEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCampaignComponent);
    component = fixture.componentInstance;

    mockCampaignService = fixture.debugElement.injector.get(CampaignService);
    spyOn(mockCampaignService, 'byId').and.returnValue(campaign);
    spyOn(mockCampaignService, 'add');

    mockLocation = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    spyOn(mockLocation, 'back');

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
    component.campaignForm.controls.name.setValue('My campaign');
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
    });

    it('should change value and save', () => {
      const de: DebugElement = fixture.debugElement;
      const nameEl: DebugElement = de.query(By.css('input.name'));
      const saveEl: DebugElement = fixture.debugElement.query(By.css('button.save'));
      
      nameEl.nativeElement.value = 'My campaign';
      nameEl.nativeElement.dispatchEvent(new Event('input'));

      component.campaignForm.controls.content.setValue('This is my campaign');

      fixture.detectChanges();

      expect(component.campaignForm.controls.name.value).toEqual('My campaign');
      
      saveEl.nativeElement.click();
      fixture.detectChanges();

      expect(mockLocation.back.calls.count()).toEqual(1);
      expect(mockCampaignService.add.calls.count()).toEqual(1);
      expect(mockCampaignService.add).toHaveBeenCalledWith('My campaign', 'This is my campaign');
    });
  });

  describe('with id param', () => {
    beforeEach(() => {
      const mockActivatedRoute: any = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
      mockActivatedRoute.queryParams = of({id: '1'});

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display corresponding campaign content', () => {
      const de: DebugElement = fixture.debugElement;
      const nameEl: DebugElement = de.query(By.css('input.name'));
      const editorEl: DebugElement = de.query(By.css('.ql-editor'));

      expect(nameEl.nativeElement.value).toBe('My campaign');
      expect(editorEl.nativeElement.innerText.trim()).toBe('Hello world');
    });

    it('should add new campaign', () => {
      const de: DebugElement = fixture.debugElement;
      const nameEl: DebugElement = de.query(By.css('input.name'));
      const editorEl: DebugElement = de.query(By.css('.ql-editor'));
      const saveEl: DebugElement = fixture.debugElement.query(By.css('button.save'));

      nameEl.nativeElement.value = 'Another campaign';
      nameEl.nativeElement.dispatchEvent(new Event('input'));

      component.campaignForm.controls.content.setValue('This is another campaign');

      fixture.detectChanges();
      saveEl.nativeElement.click();
      fixture.detectChanges();

      expect(mockLocation.back.calls.count()).toEqual(1);
      expect(mockCampaignService.add.calls.count()).toEqual(1);
      expect(mockCampaignService.add).toHaveBeenCalledWith('Another campaign', 'This is another campaign');
    });
  });
});
