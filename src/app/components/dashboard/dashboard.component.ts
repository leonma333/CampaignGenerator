import { Component, OnInit } from '@angular/core';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  campaignGroups: Campaign[][] = [[]];

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
    const campaigns: Campaign[] = this.campaignService.getAll();
    for (var i = 0; i < campaigns.length; i += 3) {
        this.campaignGroups.push(campaigns.slice(i, i + 3));
    }
  }

}
