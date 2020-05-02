import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrls: ['./edit-campaign.component.scss']
})
export class EditCampaignComponent implements OnInit {
  name: string;
  content: object;
  campaign: Campaign;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.campaign = this.campaignService.byId(id);
    this.name = this.campaign.name;
    this.content = this.campaign.content;
  }

  save(): void {
    this.campaign.name = this.name;
    this.campaign.content = this.content;
    this.campaignService.save(this.campaign);
    this.location.back();
  }

  back() {
    this.location.back();
  }

}
