import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Campaign } from '../../models/campaign';
import { Schedule } from '../../models/schedule';
import { CampaignService } from '../../services/campaign.service';
import { ModalConfirmComponent } from '../shared/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-view-campaign',
  templateUrl: './view-campaign.component.html',
  styleUrls: ['./view-campaign.component.scss']
})
export class ViewCampaignComponent implements OnInit {
  campaign = new Campaign('', '', {}, Schedule.default());
  scheduleFormat: string;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.campaignService.byId(id).subscribe(campaign => this.campaign = campaign);
  }

  back(): void {
    this.location.back();
  }

  delete(): void {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    modalRef.componentInstance.title = 'Campaign deletion';
    modalRef.componentInstance.question = 'Are you sure you want to delete this campaign?';
    modalRef.componentInstance.note = 'All information associated with "' + this.campaign.name + '" will be permanently deleted.';
    modalRef.componentInstance.irreversible = true;
    modalRef.result.then(result => {
      if (result) {
        this.campaignService.delete(this.campaign.id).then(() => this.router.navigate(['/']));
      }
    });
  }

  formatSchedule(): string {
    const schedule = new Schedule(null, null, null, null, null, null, null, null);
    schedule.from(this.campaign.schedule);
    return schedule.format();
  }

}
