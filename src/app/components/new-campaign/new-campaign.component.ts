import { Component, OnInit } from '@angular/core';

import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.scss']
})
export class NewCampaignComponent implements OnInit {
  content: object;

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
  }

  save() {
    this.campaignService.addCampaign(this.content);
  }
}
