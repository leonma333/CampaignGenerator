import { Component, OnInit, Input } from '@angular/core';

import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-dashboard-preview',
  templateUrl: './dashboard-preview.component.html',
  styleUrls: ['./dashboard-preview.component.scss']
})
export class DashboardPreviewComponent implements OnInit {
  @Input() campaign: Campaign;

  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
  }

  delete(): void {
    console.log("delete");
    this.campaignService.delete(this.campaign.id);
  }

}
