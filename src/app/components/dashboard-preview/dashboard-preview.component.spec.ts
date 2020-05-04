import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Campaign } from '../../models/campaign';
import { DashboardPreviewComponent } from './dashboard-preview.component';

describe('DashboardPreviewComponent', () => {
  const campaign: Campaign = {
    id: '1',
    name: 'My campaign',
    content: { ops: [] }
  }

  let component: DashboardPreviewComponent;
  let fixture: ComponentFixture<DashboardPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPreviewComponent);
    component = fixture.componentInstance;
    component.campaign = campaign;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
