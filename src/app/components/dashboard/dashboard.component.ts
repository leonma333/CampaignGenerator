import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { DashboardPaginationComponent } from '../dashboard-pagination/dashboard-pagination.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(DashboardPaginationComponent) pagination: DashboardPaginationComponent;

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

  constructor(private campaignService: CampaignService, private cdr: ChangeDetectorRef) { }

  asIsOrder = (a, b) => 1;

  formatter = (result: any) => result.name;

  ngOnInit(): void {
    this.searchTerm.valueChanges.subscribe(result => {
      if (result instanceof Campaign) {
        this.campaigns = [result];
        this.resetCampaignGroups();
      } else if (!result) {
        this.pagination.initializeCampaigns(this.selectedSort);
      }
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
    this.pagination.initializeCampaigns(newSort);
  }

  delete(event: string): void {
    this.campaigns = this.campaigns.filter(c => c.id !== event);
    this.resetCampaignGroups();
    this.campaignService.delete(event).then();
  }

  setCampaigns(event: Array<Campaign>): void {
    this.campaigns = event;
    this.resetCampaignGroups();
  }

  setLoading(event: boolean): void {
    this.loading = event;
    this.cdr.detectChanges();
  }
}
