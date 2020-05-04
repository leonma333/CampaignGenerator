import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { ViewCampaignComponent } from './view-campaign.component';

describe('ViewCampaignComponent', () => {
  const campaign: Campaign = {
    id: '1',
    name: 'My campaign',
    content: { ops: [] }
  }

  let component: ViewCampaignComponent;
  let fixture: ComponentFixture<ViewCampaignComponent>;
  let mockCampaignService: CampaignService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        CampaignService, {
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
});
