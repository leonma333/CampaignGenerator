import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule, QuillViewComponent } from 'ngx-quill';

import { Campaign } from '../../models/campaign';
import { campaigns } from '../../mocks/campaigns';
import { DashboardPreviewComponent } from './dashboard-preview.component';
import { NewCampaignComponent } from '../new-campaign/new-campaign.component';
import { ViewCampaignComponent } from '../view-campaign/view-campaign.component';
import { EditCampaignComponent } from '../edit-campaign/edit-campaign.component';

describe('Component: DashboardPreviewComponent', () => {
  const campaign: Campaign = campaigns[0];

  let component: DashboardPreviewComponent;
  let fixture: ComponentFixture<DashboardPreviewComponent>;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        QuillModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'new', component: NewCampaignComponent },
          { path: 'edit/:id', component: EditCampaignComponent },
          { path: 'view/:id', component: ViewCampaignComponent }
        ])
      ],
      providers: [ NgbModal ],
      declarations: [ DashboardPreviewComponent, QuillViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPreviewComponent);
    component = fixture.componentInstance;
    component.campaign = campaign;

    location = TestBed.inject(Location);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display campaign', () => {
    const de: DebugElement = fixture.debugElement;
    const nameEl: DebugElement = de.query(By.css('h3'));
    const editorEl: DebugElement = de.query(By.css('.ql-editor'));

    expect(nameEl.nativeElement.innerText).toBe('first campaign');
    expect(editorEl.nativeElement.innerText.trim()).toBe('Foo');
  });

  it('should direct to new page with id when click new button', fakeAsync(() => {
    const newEl = fixture.debugElement.query(By.css('button.new'));
    newEl.nativeElement.click();

    tick();

    expect(location.path()).toBe('/new?id=1');
  }));

  it('should direct to view page with id when click view button', fakeAsync(() => {
    const viewEl = fixture.debugElement.query(By.css('button.view'));
    viewEl.nativeElement.click();

    tick();

    expect(location.path()).toBe('/view/1');
  }));

  it('should direct to edit page with id when click edit button', fakeAsync(() => {
    const editEl = fixture.debugElement.query(By.css('button.edit'));
    editEl.nativeElement.click();

    tick();

    expect(location.path()).toBe('/edit/1');
  }));

  describe('#delete', () => {
    let id: string;

    beforeEach(() => {
      id = undefined;
      component.deleteId.subscribe(value => id = value);
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

      expect(id).toBe('1');
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

      expect(id).toBeUndefined();
    }));
  });
});
