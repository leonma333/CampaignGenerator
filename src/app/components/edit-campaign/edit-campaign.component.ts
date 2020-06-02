import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Campaign } from '../../models/campaign';
import { Schedule } from '../../models/schedule';
import { Demographic } from '../../models/demographic';
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

  showErrorAlert = false;
  errorMessage = '';

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
      schedule: new FormControl(Schedule.default()),
      demographic: new FormControl(Demographic.default())
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.campaignService.byId(id).subscribe(campaign => {
      this.campaign = campaign;
      this.campaignForm.patchValue({
        name: campaign.name,
        content: campaign.content,
        schedule: campaign.schedule,
        demographic: campaign.demographic
      });
    });
  }

  save(): void {
    this.saving = true;
    this.saving = false;
    this.campaign.name = this.campaignForm.get('name').value;
    this.campaign.content = this.campaignForm.get('content').value;
    this.campaign.schedule = this.campaignForm.get('schedule').value;
    this.campaign.demographic = this.campaignForm.get('demographic').value;
    this.campaignService.save(this.campaign).then(() => {
      this.router.navigate(['/']);
    }).catch(error => {
      this.saving = false;
      this.showErrorAlert = true;
      this.errorMessage = error.message;
    });
  }

  back() {
    this.location.back();
  }
}
