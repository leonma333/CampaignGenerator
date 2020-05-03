import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.scss']
})
export class NewCampaignComponent implements OnInit {
  campaignForm: FormGroup;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.campaignForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'content': new FormControl(null)
    });

    this.route.queryParams
      .subscribe(params => {
        if ('id' in params) {
          const campaign: Campaign = this.campaignService.byId(params.id);
          this.campaignForm.patchValue({
            'name': campaign.name,
            'content': campaign.content
          });
        }
      });
  }

  save() {
    this.campaignService.add(this.campaignForm.get('name').value, this.campaignForm.get('content').value);
    this.location.back();
  }

  back() {
    this.location.back();
  }
}
