import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { DashboardComponent } from './dashboard.component';
import { DashboardPreviewComponent } from '../dashboard-preview/dashboard-preview.component';

describe('Component: DashboardComponent', () => {
  const campaigns: Array<Campaign> = [
    {id: '1', name: '', content: {ops: []}},
    {id: '2', name: '', content: {ops: []}},
    {id: '3', name: '', content: {ops: []}},
    {id: '4', name: '', content: {ops: []}},
  ];

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockCampaignService: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ CampaignService ],
      declarations: [ DashboardComponent, DashboardPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    mockCampaignService = fixture.debugElement.injector.get(CampaignService);
    spyOn(mockCampaignService, 'getAll').and.returnValue(campaigns);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

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
