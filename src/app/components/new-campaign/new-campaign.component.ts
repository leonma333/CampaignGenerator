import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.scss']
})
export class NewCampaignComponent implements OnInit {
  content: object;
  name: string;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if ('content' in params)
          this.content = JSON.parse(params.content);
      });
  }

  save() {
    this.campaignService.add(this.name, this.content);
    this.location.back();
  }

  back() {
    this.location.back();
  }
}
