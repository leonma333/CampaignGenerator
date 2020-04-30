import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCampaignComponent } from './new-campaign.component';

describe('NewCampaignComponent', () => {
  let component: NewCampaignComponent;
  let fixture: ComponentFixture<NewCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
