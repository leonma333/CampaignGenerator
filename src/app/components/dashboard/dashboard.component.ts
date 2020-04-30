import { Component, OnInit } from '@angular/core';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	campaigns: Campaign[] = [];

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
  	this.campaigns = this.campaignService.getCampaigns();
  }

}
