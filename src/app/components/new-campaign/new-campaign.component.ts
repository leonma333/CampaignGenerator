import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Schedule } from '../../models/schedule';
import { Demographic } from '../../models/demographic';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.scss']
})
export class NewCampaignComponent implements OnInit {
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

    this.route.queryParams
      .subscribe(params => {
        if ('id' in params) {
          this.campaignService.byId(params.id).subscribe(campaign => {
            this.campaignForm.patchValue({
              name: campaign.name,
              content: campaign.content,
              schedule: campaign.schedule,
              demographic: campaign.demographic
            });
          });
        }
      });
  }

  save() {
    this.saving = true;
    this.showErrorAlert = false;
    this.campaignService.add(
      this.campaignForm.get('name').value,
      this.campaignForm.get('content').value,
      this.campaignForm.get('schedule').value,
      this.campaignForm.get('demographic').value
    ).then(() => {
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
