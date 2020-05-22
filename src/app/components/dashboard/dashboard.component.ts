import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { Subscription, Observable } from 'rxjs';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  searchTerm = new FormControl(null);
  selectedSort = 'timestamp';
  sorts = {
    timestamp: 'Updated at',
    start: 'Started on'
  };

  private campaigns$: Subscription;

  constructor(private campaignService: CampaignService) { }

  asIsOrder = (a, b) => 1;

  formatter = (result: any) => result.name;

  ngOnInit(): void {
    this.initializeCampaigns();
    this.searchTerm.valueChanges.subscribe(result => {
      if (result instanceof Campaign) {
        this.campaigns = [result];
        this.resetCampaignGroups();
      } else if (!result) {
        this.initializeCampaigns(this.selectedSort);
      }
    });
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

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term =>
        this.campaignService.search(term)
      ),
    );
  }

  changeSort(newSort: string): void {
    this.selectedSort = newSort;
    this.initializeCampaigns(newSort);
  }

  delete(event: string): void {
    this.campaigns = this.campaigns.filter(c => c.id !== event);
    this.resetCampaignGroups();
    this.campaignService.delete(event).then();
  }

}
