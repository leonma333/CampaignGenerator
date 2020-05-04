import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { EditCampaignComponent } from './edit-campaign.component';

describe('EditCampaignComponent', () => {
  const campaign: Campaign = {
    id: '1',
    name: 'My campaign',
    content: { ops: [] }
  }

  let component: EditCampaignComponent;
  let fixture: ComponentFixture<EditCampaignComponent>;
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
      declarations: [ EditCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCampaignComponent);
    component = fixture.componentInstance;

    mockCampaignService = fixture.debugElement.injector.get(CampaignService);
    spyOn(mockCampaignService, 'byId').and.returnValue(campaign);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
