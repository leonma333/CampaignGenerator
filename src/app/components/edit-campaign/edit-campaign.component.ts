import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrls: ['./edit-campaign.component.scss']
})
export class EditCampaignComponent implements OnInit {
  campaign: Campaign;
  campaignForm: FormGroup;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.campaign = this.campaignService.byId(id);
    this.campaignForm = new FormGroup({
      'name': new FormControl(this.campaign.name, Validators.required),
      'content': new FormControl(this.campaign.content)
    });
  }

  save(): void {
    this.campaign.name = this.campaignForm.get('name').value;
    this.campaign.content = this.campaignForm.get('content').value;
    this.campaignService.save(this.campaign);
    this.location.back();
  }

  back() {
    this.location.back();
  }

}
