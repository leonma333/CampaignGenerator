import { Component, OnInit } from '@angular/core';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  campaigns: Array<Campaign>;
  campaignGroups: Array<Array<Campaign>>;

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
    this.campaigns = this.campaignService.getAll();
    this.resetCampaignGroups();
  }

  resetCampaignGroups(): void {
    this.campaignGroups = [];
    for (let i = 0; i < this.campaigns.length; i += 3) {
      this.campaignGroups.push(this.campaigns.slice(i, i + 3));
    }
  }

  delete(event: string): void {
    this.campaigns = this.campaigns.filter(c => c.id !== event);
    this.resetCampaignGroups();
    this.campaignService.delete(event);
  }

}
