import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
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
    mockCampaignService.getAll.and.callFake((sort, options) => {
        if (options && options.startAfter) {
          if (options.startAfter === '7') {
            return of([]);
          }
          if (options.startAfter === '6') {
            return of([campaigns[6]]);
          }
          expect(options.startAfter).toEqual('3');
          return of(campaigns.slice(3, 6));
        } else if (options && options.startAt && options.endBefore) {
          if (options.startAt === '1') {
            expect(options.endBefore).toEqual('4');
            return of(campaigns.slice(0, 3));
          }
          if (options.startAt === '4') {
            expect(options.endBefore).toEqual('7');
            return of(campaigns.slice(3, 6));
          }
          throw new Error('should not be here');
        }
        return of(campaigns.slice(0, 3));
      });

    spyOn(component.loading, 'emit');
    spyOn(component.campaigns, 'emit');

    fixture.detectChanges();
  });

  function nextPage() {
    const nextPageEl: DebugElement = fixture.debugElement.query(By.css('.next-page'));
    nextPageEl.nativeElement.click();
  }

  function prevPage() {
    const prevPageEl: DebugElement = fixture.debugElement.query(By.css('.prev-page'));
    prevPageEl.nativeElement.click();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.page).toBe(1);
    expect(component.disabledPrev).toBeTrue();
    expect(component.disabledNext).toBeFalse();

    let emitSpy = component.loading.emit as any;
    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy.calls.allArgs()[0][0]).toBeTrue();

    emitSpy = component.campaigns.emit as any;
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy.calls.allArgs()[0][0]).toEqual(campaigns.slice(0, 3));
  });

  it('should emit campaigns when change page', () => {
    nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(2);
    expect(component.disabledPrev).toBeFalse();
    expect(component.disabledNext).toBeFalse();

    const emitSpy = component.campaigns.emit as any;
    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy.calls.mostRecent().args[0]).toEqual(campaigns.slice(3, 6));

    nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(3);
    expect(component.disabledPrev).toBeFalse();
    expect(component.disabledNext).toBeFalse();

    expect(emitSpy).toHaveBeenCalledTimes(3);
    expect(emitSpy.calls.mostRecent().args[0]).toEqual([campaigns[6]]);

    nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(3);
    expect(component.disabledPrev).toBeFalse();
    expect(component.disabledNext).toBeTrue();

    expect(emitSpy).toHaveBeenCalledTimes(3);

    prevPage();
    fixture.detectChanges();

    expect(component.page).toBe(2);
    expect(component.disabledPrev).toBeFalse();
    expect(component.disabledNext).toBeFalse();

    expect(emitSpy).toHaveBeenCalledTimes(4);
    expect(emitSpy.calls.mostRecent().args[0]).toEqual(campaigns.slice(3, 6));

    prevPage();
    fixture.detectChanges();

    expect(component.page).toBe(1);
    expect(component.disabledPrev).toBeTrue();
    expect(component.disabledNext).toBeFalse();

    expect(emitSpy).toHaveBeenCalledTimes(5);
    expect(emitSpy.calls.mostRecent().args[0]).toEqual(campaigns.slice(0, 3));
  });
});
