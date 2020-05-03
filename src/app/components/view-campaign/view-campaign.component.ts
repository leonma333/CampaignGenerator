import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Campaign } from '../../models/campaign';
import { CampaignService } from '../../services/campaign.service';
import { ModalConfirmComponent } from '../shared/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-view-campaign',
  templateUrl: './view-campaign.component.html',
  styleUrls: ['./view-campaign.component.scss']
})
export class ViewCampaignComponent implements OnInit {
	campaign: Campaign;

  constructor(
  	private campaignService: CampaignService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  	const id = this.route.snapshot.paramMap.get('id');
    this.campaign = this.campaignService.byId(id);
  }

  back(): void {
  	this.location.back();
  }

  delete(): void {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    modalRef.componentInstance.title = "Campaign deletion"
    modalRef.componentInstance.question = "Are you sure you want to delete this campaign?";
    modalRef.componentInstance.note = "All information associated with \"" + this.campaign.name + "\" will be permanently deleted.";
    modalRef.componentInstance.irreversible = true;
    modalRef.result.then(result => {
      if (result) {
        this.campaignService.delete(this.campaign.id);
        this.location.back();
      }
    });
  }

}
