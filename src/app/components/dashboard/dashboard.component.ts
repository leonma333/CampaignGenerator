import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

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

  loading = true;
  faSpinner = faSpinner;
  selectedSort = 'timestamp';
  sorts = {
    timestamp: 'Updated at',
    start: 'Started on'
  };

  private campaigns$: Subscription;

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
    this.initializeCampaigns();
  }

  initializeCampaigns(sort = 'timestamp'): void {
    this.loading = true;
    if (this.campaigns$) {
      this.campaigns$.unsubscribe();
    }
    this.campaigns$ = this.campaignService.getAll(sort).subscribe(campaigns => {
      this.campaigns = campaigns;
      this.resetCampaignGroups();
      this.loading = false;
    });
  }

  resetCampaignGroups(): void {
    this.campaignGroups = [];
    for (let i = 0; i < this.campaigns.length; i += 3) {
      this.campaignGroups.push(this.campaigns.slice(i, i + 3));
    }
  }

  changeSort(newSort: string): void {
    console.log(`change to ${newSort}`);
    this.selectedSort = newSort;
    this.initializeCampaigns(newSort);
  }

  delete(event: string): void {
    this.campaigns = this.campaigns.filter(c => c.id !== event);
    this.resetCampaignGroups();
    this.campaignService.delete(event).then();
  }

}
