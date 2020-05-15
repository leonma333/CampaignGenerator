import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';

import { of } from 'rxjs';
import { QuillModule, QuillViewComponent } from 'ngx-quill';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { campaigns } from '../../mocks/campaigns';
import { CampaignService } from '../../services/campaign.service';
import { ViewCampaignComponent } from './view-campaign.component';
import { EditCampaignComponent } from '../edit-campaign/edit-campaign.component';

describe('Component: ViewCampaignComponent', () => {
  let component: ViewCampaignComponent;
  let fixture: ComponentFixture<ViewCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        QuillModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'edit/:id', component: EditCampaignComponent }
        ])
      ],
      providers: [
        Location,
        NgbModal, {
          provide: CampaignService,
          useValue: jasmine.createSpyObj('mockCampaignService', ['byId', 'delete'])
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
      declarations: [ ViewCampaignComponent, QuillViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCampaignComponent);
    component = fixture.componentInstance;

    const mockCampaignService = TestBed.inject(CampaignService) as jasmine.SpyObj<CampaignService>;
    mockCampaignService.byId.and.returnValue(of(campaigns[0]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const nameEl: DebugElement = fixture.debugElement.query(By.css('input.name'));
    expect(nameEl.nativeElement.readOnly).toBeTrue();
  });

  it('should display campaign', () => {
    const de: DebugElement = fixture.debugElement;
    const nameEl: DebugElement = de.query(By.css('input.name'));
    const editorEl: DebugElement = de.query(By.css('.ql-editor'));
    const scheduleEl: DebugElement = de.query(By.css('div#static-1 .card-body'));

    expect(nameEl.nativeElement.value).toBe('first campaign');
    expect(editorEl.nativeElement.innerText.trim()).toBe('Foo');
    expect(scheduleEl.nativeElement.innerText).toBe('Scheduled on 2020-06-30 @ 12:00');
  });

  it('should call back when click back button', () => {
    const mockLocation = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    spyOn(mockLocation, 'back');

    const closeEl: DebugElement = fixture.debugElement.query(By.css('button.back'));

    closeEl.nativeElement.click();
    fixture.detectChanges();
    expect(mockLocation.back.calls.count()).toEqual(1);
  });

  it('should direct to edit page with id when click edit button', fakeAsync(() => {
    const location: Location = TestBed.inject(Location);

    const editEl = fixture.debugElement.query(By.css('button.edit'));
    editEl.nativeElement.click();

    tick();

    expect(location.path()).toBe('/edit/1');
  }));

  describe('#delete', () => {
    let mockRouter: any;
    let mockLocation: any;
    let mockCampaignService: any;

    beforeEach(() => {
      mockLocation = TestBed.inject(Location);
      spyOn(mockLocation, 'back');

      mockCampaignService = TestBed.inject(CampaignService);
      mockCampaignService.delete.and.returnValue(new Promise(resolve => resolve(true)));

      mockRouter = TestBed.inject(Router);
      spyOn(mockRouter, 'navigate');
    });

    it('should delete if confirm on modal', fakeAsync(() => {
      const mockNbgModalRef = jasmine.createSpyObj('mockNbgModalRef', ['componentInstance'], {
        result: new Promise(resolve => resolve(true))
      });

      const mockNgbModal = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
      spyOn(mockNgbModal, 'open').and.returnValue(mockNbgModalRef);

      const deleteEl: DebugElement = fixture.debugElement.query(By.css('button.delete'));
      deleteEl.nativeElement.click();

      tick();

      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      expect(mockCampaignService.delete.calls.count()).toEqual(1);
      expect(mockCampaignService.delete).toHaveBeenCalledWith('1');
    }));

    it('should not delete if dismiss on modal', fakeAsync(() => {
      const mockNbgModalRef = jasmine.createSpyObj('mockNbgModalRef', ['componentInstance'], {
        result: new Promise(resolve => resolve(false))
      });

      const mockNgbModal = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
      spyOn(mockNgbModal, 'open').and.returnValue(mockNbgModalRef);

      const deleteEl: DebugElement = fixture.debugElement.query(By.css('button.delete'));
      deleteEl.nativeElement.click();

      tick();

      expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
      expect(mockCampaignService.delete.calls.count()).toEqual(0);
    }));
  });

});
