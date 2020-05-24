import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { DashboardPaginationComponent } from './dashboard-pagination.component';

describe('Component: DashboardPaginationComponent', () => {
  let component: DashboardPaginationComponent;
  let fixture: ComponentFixture<DashboardPaginationComponent>;
  let mockCampaignService: any;

  const campaigns = [
    new Campaign('1', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 15}}),
    new Campaign('2', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 30}}),
    new Campaign('3', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 20}}),
    new Campaign('4', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 25}}),
    new Campaign('5', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 25}}),
    new Campaign('6', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 25}}),
    new Campaign('7', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 25}})
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: CampaignService,
        useValue: jasmine.createSpyObj('mockCampaignService', ['getAll'])
      }],
      declarations: [ DashboardPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPaginationComponent);
    component = fixture.componentInstance;

    campaigns.forEach(campaign => campaign.doc = campaign.id);
    mockCampaignService = TestBed.inject(CampaignService);
    mockCampaignService.getAll.and.returnValue(of(campaigns));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
