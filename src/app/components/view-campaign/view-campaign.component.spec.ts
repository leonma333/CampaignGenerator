import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { ViewCampaignComponent } from './view-campaign.component';
import { EditCampaignComponent } from '../edit-campaign/edit-campaign.component';

describe('Component: ViewCampaignComponent', () => {
  const campaign: Campaign = {
    id: '1',
    name: 'My campaign',
    content: { ops: [] }
  };

  let component: ViewCampaignComponent;
  let fixture: ComponentFixture<ViewCampaignComponent>;
  let mockCampaignService: CampaignService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'edit/:id', component: EditCampaignComponent }
        ])
      ],
      providers: [
        CampaignService,
        Location,
        NgbModal, {
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
      declarations: [ ViewCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCampaignComponent);
    component = fixture.componentInstance;

    mockCampaignService = fixture.debugElement.injector.get(CampaignService);
    spyOn(mockCampaignService, 'byId').and.returnValue(campaign);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    const location: Location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    const editEl = fixture.debugElement.query(By.css('button.edit'));
    editEl.nativeElement.click();

    tick();

    expect(location.path()).toBe('/edit/1');
  }));

  describe('#delete', () => {
    it('should delete if confirm on modal', fakeAsync(() => {
      const mockLocation = TestBed.inject(Location) as jasmine.SpyObj<Location>;
      spyOn(mockLocation, 'back');

      const mockNbgModalRef = jasmine.createSpyObj('mockNbgModalRef', ['componentInstance'], {
        result: new Promise(resolve => resolve(true))
      });

      const mockNgbModal = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
      spyOn(mockNgbModal, 'open').and.returnValue(mockNbgModalRef);

      const mockCampaignServiceDup = TestBed.inject(CampaignService) as jasmine.SpyObj<CampaignService>;
      spyOn(mockCampaignServiceDup, 'delete');

      const deleteEl: DebugElement = fixture.debugElement.query(By.css('button.delete'));
      deleteEl.nativeElement.click();

      tick();

      expect(mockLocation.back.calls.count()).toEqual(1);
      expect(mockCampaignServiceDup.delete.calls.count()).toEqual(1);
      expect(mockCampaignServiceDup.delete).toHaveBeenCalledWith(campaign.id);
    }));
  });

});
