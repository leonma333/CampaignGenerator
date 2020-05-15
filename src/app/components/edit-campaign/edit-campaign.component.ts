import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Campaign } from '../../models/campaign';
import { Schedule } from '../../models/schedule';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrls: ['./edit-campaign.component.scss']
})
export class EditCampaignComponent implements OnInit {
  campaign: Campaign;
  campaignForm: FormGroup;

  saving = false;
  faSpinner = faSpinner;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.campaignForm = new FormGroup({
      name: new FormControl('', Validators.required),
      content: new FormControl(null),
      schedule: new FormControl(Schedule.default())
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.campaignService.byId(id).subscribe(campaign => {
      this.campaign = campaign;
      this.campaignForm.patchValue({
        name: campaign.name,
        content: campaign.content,
        schedule: campaign.schedule
      });
    });
  }

  save(): void {
    this.saving = true;
    this.campaign.name = this.campaignForm.get('name').value;
    this.campaign.content = this.campaignForm.get('content').value;
    this.campaign.schedule = this.campaignForm.get('schedule').value;
    this.campaignService.save(this.campaign).then(() => {
      this.router.navigate(['/']);
    });
  }

  back() {
    this.location.back();
  }
}
