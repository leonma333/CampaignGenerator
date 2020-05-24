import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { take, map } from 'rxjs/operators';
import { Observable, interval, of } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { DashboardComponent } from './dashboard.component';
import { DashboardPreviewComponent } from '../dashboard-preview/dashboard-preview.component';
import { DashboardPaginationComponent } from '../dashboard-pagination/dashboard-pagination.component';

describe('Component: DashboardComponent', () => {
  const campaigns = [
    new Campaign('1', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 15}}),
    new Campaign('2', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 30}}),
    new Campaign('3', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 20}}),
    new Campaign('4', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 25}})
  ];

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockCampaignService: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, NgbModule ],
      providers: [{
        provide: CampaignService,
        useValue: jasmine.createSpyObj('mockCampaignService', ['getAll', 'delete', 'search'])
      }],
      declarations: [ DashboardComponent, DashboardPreviewComponent, DashboardPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    expect(component.loading).toBeTrue();

    campaigns.forEach(campaign => campaign.doc = campaign.id);

    mockCampaignService = TestBed.inject(CampaignService);
    mockCampaignService.getAll.and.callFake(sort => {
      if (sort === 'start') {
        return of([campaigns[1], campaigns[3], campaigns[2], campaigns[0]]);
      }
      return of(campaigns);
    });

    fixture.detectChanges();
  });

  function changeSort(type: string) {
    let sortEl: DebugElement = fixture.debugElement.query(By.css('#sortBy'));
    sortEl.nativeElement.click();
    fixture.detectChanges();
    const sortsEl: Array<DebugElement> = fixture.debugElement.queryAll(By.css('div[aria-labelledby="sortBy"] button'));
    for (const el of sortsEl) {
      if (el.nativeElement.innerText === type) {
        sortEl = el;
      }
    }
    sortEl.nativeElement.click();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.loading).toBeFalse();

    const previewComponents: Array<DebugElement> = fixture.debugElement.queryAll(By.directive(DashboardPreviewComponent));
    expect(previewComponents.length).toBe(4);

    const rowEl: Array<DebugElement> = fixture.debugElement.queryAll(By.css('.campaign-group'));
    expect(rowEl.length).toBe(2);
    expect(rowEl[0].nativeElement.querySelectorAll('.campaign-col').length).toBe(3);
    expect(rowEl[1].nativeElement.querySelectorAll('.campaign-col').length).toBe(1);

    const startDateEl: Array<DebugElement> = fixture.debugElement.queryAll(By.css('.start-date'));
    expect(startDateEl[0].nativeElement.innerText).toBe('Started on 2020-06-15');
    expect(startDateEl[1].nativeElement.innerText).toBe('Started on 2020-06-30');
    expect(startDateEl[2].nativeElement.innerText).toBe('Started on 2020-06-20');
    expect(startDateEl[3].nativeElement.innerText).toBe('Started on 2020-06-25');
  });

  it('should delete campaign', () => {
    mockCampaignService.delete.and.returnValue(new Promise(resolve => resolve(true)));

    let previewComponents: Array<DebugElement> = fixture.debugElement.queryAll(By.directive(DashboardPreviewComponent));
    previewComponents[1].componentInstance.deleteId.emit('2');

    fixture.detectChanges();

    previewComponents = fixture.debugElement.queryAll(By.directive(DashboardPreviewComponent));
    expect(previewComponents.length).toBe(3);

    const rowEl: Array<DebugElement> = fixture.debugElement.queryAll(By.css('.campaign-group'));
    expect(rowEl.length).toBe(1);
    expect(rowEl[0].nativeElement.querySelectorAll('.campaign-col').length).toBe(3);
    expect(mockCampaignService.delete).toHaveBeenCalledTimes(1);
    expect(mockCampaignService.delete).toHaveBeenCalledWith('2');
  });

  it('should change sort', () => {
    changeSort('Started on');

    fixture.detectChanges();

    let startDateEl: Array<DebugElement> = fixture.debugElement.queryAll(By.css('.start-date'));
    expect(startDateEl[0].nativeElement.innerText).toBe('Started on 2020-06-30');
    expect(startDateEl[1].nativeElement.innerText).toBe('Started on 2020-06-25');
    expect(startDateEl[2].nativeElement.innerText).toBe('Started on 2020-06-20');
    expect(startDateEl[3].nativeElement.innerText).toBe('Started on 2020-06-15');

    expect(mockCampaignService.getAll).toHaveBeenCalledTimes(2);
    expect(mockCampaignService.getAll.calls.mostRecent().args).toEqual(['start']);

    changeSort('Updated at');

    fixture.detectChanges();

    startDateEl = fixture.debugElement.queryAll(By.css('.start-date'));
    expect(startDateEl[0].nativeElement.innerText).toBe('Started on 2020-06-15');
    expect(startDateEl[1].nativeElement.innerText).toBe('Started on 2020-06-30');
    expect(startDateEl[2].nativeElement.innerText).toBe('Started on 2020-06-20');
    expect(startDateEl[3].nativeElement.innerText).toBe('Started on 2020-06-25');

    expect(mockCampaignService.getAll).toHaveBeenCalledTimes(3);
    expect(mockCampaignService.getAll.calls.mostRecent().args).toEqual(['timestamp']);
  });

  describe('search bar', () => {
    it('#search should return result from campaign service', fakeAsync(() => {
      mockCampaignService.search.and.callFake(term => {
        if (term === 'Bing' || term === 'Bingo') {
          return of([campaigns[0]]);
        } else if (term.startsWith('Bin')) {
          return of([campaigns[0], campaigns[1]]);
        }
        return of(campaigns);
      });

      const inputTests = ['B', 'Bi', 'Bin', 'Bing', 'Bingo'];
      const textMock$: Observable<string> = interval(250).pipe(take(5), map(index => inputTests[index]));
      let i = 0;

      component.search(textMock$).subscribe(result => {
        if (i < 2) {
          expect(result).toEqual(campaigns);
        } else if (i === 2) {
          expect(result).toEqual([campaigns[0], campaigns[1]]);
        } else {
          expect(result).toEqual([campaigns[0]]);
        }
        i += 1;
      });

      tick(1500);
      expect(mockCampaignService.search).toHaveBeenCalledTimes(5);
    }));

    it('update search term should show new result', fakeAsync(() => {
      component.searchTerm.setValue(campaigns[0]);

      tick();
      fixture.detectChanges();

      let rowEl: Array<DebugElement> = fixture.debugElement.queryAll(By.css('.campaign-group'));
      expect(rowEl.length).toBe(1);
      expect(rowEl[0].nativeElement.querySelectorAll('.campaign-col').length).toBe(1);
      expect(component.campaigns.length).toBe(1);

      component.searchTerm.setValue('Bin');

      tick();
      fixture.detectChanges();

      rowEl = fixture.debugElement.queryAll(By.css('.campaign-group'));
      expect(rowEl.length).toBe(1);
      expect(rowEl[0].nativeElement.querySelectorAll('.campaign-col').length).toBe(1);
      expect(component.campaigns.length).toBe(1);

      component.searchTerm.setValue('');

      tick();
      fixture.detectChanges();

      rowEl = fixture.debugElement.queryAll(By.css('.campaign-group'));
      expect(rowEl.length).toBe(2);
    }));
  });

  describe('pagination', () => {
    function nextPage() {
      const nextPageEl: DebugElement = fixture.debugElement.query(By.css('.next-page'));
      nextPageEl.nativeElement.click();
    }

    function prevPage() {
      const prevPageEl: DebugElement = fixture.debugElement.query(By.css('.prev-page'));
      prevPageEl.nativeElement.click();
    }

    it('should change page', () => {
      const moreCampaigns = [...campaigns];
      moreCampaigns.push(
        new Campaign('5', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 25}}),
        new Campaign('6', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 25}}),
        new Campaign('7', '', {ops: []}, {dateStart: {year: 2020, month: 6, day: 25}})
      );
      moreCampaigns.forEach(campaign => campaign.doc = campaign.id);
      mockCampaignService.getAll.and.callFake((sort, options) => {
        if (options && options.startAfter) {
          if (options.startAfter === '7') {
            return of([]);
          }
          expect(options.startAfter).toEqual('6');
          return of([moreCampaigns[6]]);
        } else if (options && options.startAt && options.endBefore) {
          expect(options.startAt).toEqual('1');
          expect(options.endBefore).toEqual('7');
        }
        return of(moreCampaigns.slice(0, 6));
      });

      component.pagination.ngOnInit();
      fixture.detectChanges();

      let rowEl: Array<DebugElement> = fixture.debugElement.queryAll(By.css('.campaign-group'));
      expect(rowEl.length).toBe(2);
      expect(fixture.debugElement.queryAll(By.css('.campaign-col')).length).toBe(6);

      nextPage();
      fixture.detectChanges();

      rowEl = fixture.debugElement.queryAll(By.css('.campaign-group'));
      expect(rowEl.length).toBe(1);
      expect(fixture.debugElement.queryAll(By.css('.campaign-col')).length).toBe(1);

      nextPage();
      fixture.detectChanges();

      rowEl = fixture.debugElement.queryAll(By.css('.campaign-group'));
      expect(rowEl.length).toBe(1);
      expect(fixture.debugElement.queryAll(By.css('.campaign-col')).length).toBe(1);

      const nextPageEl: DebugElement = fixture.debugElement.query(By.css('.next-page'));
      expect(nextPageEl.nativeElement.disabled).toBeTrue();

      prevPage();
      fixture.detectChanges();

      rowEl = fixture.debugElement.queryAll(By.css('.campaign-group'));
      expect(rowEl.length).toBe(2);
      expect(fixture.debugElement.queryAll(By.css('.campaign-col')).length).toBe(6);
    });
  });
});
