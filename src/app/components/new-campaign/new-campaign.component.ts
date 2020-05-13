import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Campaign } from '../../models/campaign';
import { Schedule } from '../../models/schedule';
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

    this.route.queryParams
      .subscribe(params => {
        if ('id' in params) {
          this.campaignService.byId(params.id).subscribe(campaign => {
            this.campaignForm.patchValue({
              name: campaign.name,
              content: campaign.content,
              schedule: campaign.schedule
            });
          });
        }
      });
  }

  save() {
    this.saving = true;
    this.campaignService.add(
      this.campaignForm.get('name').value,
      this.campaignForm.get('content').value,
      this.campaignForm.get('schedule').value
    ).then(() => {
      this.router.navigate(['/']);
    });
  }

  back() {
    this.location.back();
  }
}
