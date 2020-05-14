import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { of } from 'rxjs';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { DashboardComponent } from './dashboard.component';
import { DashboardPreviewComponent } from '../dashboard-preview/dashboard-preview.component';

describe('Component: DashboardComponent', () => {
  const campaigns = of([
    new Campaign('1', '', {ops: []}, {type: 'onetime'}),
    new Campaign('2', '', {ops: []}, {type: 'onetime'}),
    new Campaign('3', '', {ops: []}, {type: 'onetime'}),
    new Campaign('4', '', {ops: []}, {type: 'onetime'})
  ]);

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockCampaignService: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: CampaignService,
        useValue: jasmine.createSpyObj('mockCampaignService', ['getAll'])
      }],
      declarations: [ DashboardComponent, DashboardPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    expect(component.loading).toBeTrue();

    mockCampaignService = TestBed.inject(CampaignService);
    mockCampaignService.getAll.and.returnValue(campaigns);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.loading).toBeFalse();

    const previewComponents: Array<DebugElement> = fixture.debugElement.queryAll(By.directive(DashboardPreviewComponent));
    expect(previewComponents.length).toBe(4);

    const rowEl: Array<DebugElement> = fixture.debugElement.queryAll(By.css('div.row'));
    expect(rowEl.length).toBe(2);
    expect(rowEl[0].nativeElement.querySelectorAll('div.col-md-4').length).toBe(3);
    expect(rowEl[1].nativeElement.querySelectorAll('div.col-md-4').length).toBe(1);
  });

  it('should delete campaign', () => {
    let previewComponents: Array<DebugElement> = fixture.debugElement.queryAll(By.directive(DashboardPreviewComponent));
    previewComponents[1].componentInstance.deleteId.emit('2');

    fixture.detectChanges();

    previewComponents = fixture.debugElement.queryAll(By.directive(DashboardPreviewComponent));
    expect(previewComponents.length).toBe(3);

    const rowEl: Array<DebugElement> = fixture.debugElement.queryAll(By.css('div.row'));
    expect(rowEl.length).toBe(1);
    expect(rowEl[0].nativeElement.querySelectorAll('div.col-md-4').length).toBe(3);
  });
});
