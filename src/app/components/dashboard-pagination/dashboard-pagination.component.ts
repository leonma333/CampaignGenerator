import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { first } from 'rxjs/operators';
import { faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-dashboard-pagination',
  templateUrl: './dashboard-pagination.component.html',
  styleUrls: ['./dashboard-pagination.component.scss']
})
export class DashboardPaginationComponent implements OnInit {
  @Input() sort: string;
  @Output() loading: EventEmitter<boolean> = new EventEmitter();
  @Output() campaigns: EventEmitter<Array<Campaign>> = new EventEmitter();

  faForward = faForward;
  faBackward = faBackward;

  page = 1;
  disabledPrev = true;
  disabledNext = false;

  private firstDoc: any = null;
  private lastDoc: any = null;
  private prevStartAt: Array<any> = [];

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
    this.initializeCampaigns();
  }

  initializeCampaigns(sort = 'timestamp'): void {
    this.loading.emit(true);
    this.campaignService.getAll(sort).pipe(first()).subscribe(campaigns => {
      this.disabledPrev = true;
      this.disabledNext = false;
      this.firstDoc = campaigns[0].doc;
      this.lastDoc = campaigns[campaigns.length - 1].doc;

      this.campaigns.emit(campaigns);
      this.loading.emit(false);
    });
  }

  nextPage(): void {
    this.loading.emit(true);
    this.disabledNext = true;
    this.campaignService.getAll(this.sort, {startAfter: this.lastDoc}).pipe(first()).subscribe(campaigns => {
      if (!campaigns.length) {
        this.loading.emit(false);
        return;
      }

      this.prevStartAt.push(this.firstDoc);
      this.firstDoc = campaigns[0].doc;
      this.lastDoc = campaigns[campaigns.length - 1].doc;

      this.page += 1;
      this.disabledNext = false;
      this.disabledPrev = false;

      this.campaigns.emit(campaigns);
      this.loading.emit(false);
    });
  }

  prevPage(): void {
    this.loading.emit(true);
    this.disabledPrev = true;
    this.campaignService.getAll(this.sort, {startAt: this.prevStartAt.pop(), endBefore: this.firstDoc})
      .pipe(first()).subscribe(campaigns => {
        this.firstDoc = campaigns[0].doc;
        this.lastDoc = campaigns[campaigns.length - 1].doc;

        this.page -= 1;
        this.disabledNext = false;
        if (this.page > 1) {
          this.disabledPrev = false;
        }

        this.campaigns.emit(campaigns);
        this.loading.emit(false);
      });
  }
}
